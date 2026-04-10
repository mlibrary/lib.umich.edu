/**
 * Astro Page Generator - Replacement for Gatsby's createPages API
 *
 * This module helps generate dynamic pages from Drupal data
 */
import {
  fetchDrupalBuildings,
  fetchDrupalFloorPlans,
  fetchDrupalLocations,
  fetchDrupalPages,
  fetchDrupalRooms,
  fetchDrupalSectionPages,
  fetchFromDrupal
} from './drupal.js';
import { fetchDrupalDepartments } from './staff-data.js';
import { fetchDrupalEvents } from './events-data.js';
import { fetchDrupalNews } from './news-data.js';

/**
 * Fetch breadcrumb data from Drupal API (matches Gatsby plugin behavior)
 * @param {string} breadcrumbUrl - The breadcrumb API endpoint URL
 * @returns {Promise<Object[]|null>} - Breadcrumb data or null if fetch fails
 */
const fetchDrupalBreadcrumb = async (breadcrumbUrl) => {
  try {
    // Normalize to a relative path for fetchFromDrupal (which has retry + backoff)
    const baseUrl = (process.env.DRUPAL_URL || 'https://cms.lib.umich.edu').replace(/\/$/u, '');
    const path = breadcrumbUrl.startsWith('http')
      ? breadcrumbUrl.replace(baseUrl, '')
      : breadcrumbUrl;
    return await fetchFromDrupal(path);
  } catch (error) {
    return null;
  }
};

/**
 * Sanitize Drupal view data (matches Gatsby plugin sanitizeDrupalView)
 * Drupal custom view APIs can return "empty" results as nested arrays.
 */
const sanitizeDrupalView = (data) => {
  if (Array.isArray(data)) {
    if (data[0] && !Array.isArray(data[0])) {
      return data;
    }
  }
  return null;
};

/**
 * Fetch parent/child menu ordering data from Drupal custom view endpoints.
 * These are the same endpoints Gatsby fetched during onCreateNode via
 * field_parent_menu / field_child_menu attributes on each node.
 *
 * @param {Object} node - A processed Drupal node
 * @returns {Promise<{parentIds: string[], childIds: string[]}>}
 */
const fetchMenuOrderData = async (node) => {
  const attrs = node.attributes || {};
  const result = { childIds: [], parentIds: [] };

  const fetchMenuField = async (fieldValue) => {
    if (!fieldValue) {
      return [];
    }
    try {
      const data = await fetchFromDrupal(fieldValue);
      const sanitized = sanitizeDrupalView(data);
      return sanitized
        ? sanitized.map(({ uuid }) => {
            return uuid;
          })
        : [];
    } catch {
      return [];
    }
  };

  result.parentIds = await fetchMenuField(attrs.field_parent_menu);
  result.childIds = await fetchMenuField(attrs.field_child_menu);

  return result;
};

/**
 * Resolve an ordered list of UUIDs to actual section page nodes.
 * Returns data in Gatsby edges format: [{node: {...}}, ...]
 *
 * @param {string[]} uuids - Ordered Drupal UUIDs
 * @param {Object[]} allProcessedNodes - All processed nodes from page generation
 * @param {string} [nodeType] - Optional JSON:API type to filter by (e.g. 'node--section_page')
 * @returns {Object[]} - Edges-format array [{node: {...}}, ...]
 */
const resolveMenuNodes = (uuids, allProcessedNodes, nodeType) => {
  if (!uuids || uuids.length === 0) {
    return [];
  }
  return uuids
    .map((uuid) => {
      const found = allProcessedNodes.find((processedNode) => {
        if (nodeType && processedNode.type !== nodeType) {
          return false;
        }
        return processedNode.id === uuid;
      });
      if (!found) {
        return null;
      }
      // Return in Gatsby edges format for processHorizontalNavigationData compatibility
      return {
        node: {
          drupal_id: found.id,
          field_title_context: found.attributes?.field_title_context || found.title,
          fields: {
            slug: found.slug
          },
          title: found.title
        }
      };
    })
    .filter(Boolean);
};

/**
 * Process Drupal breadcrumb data (matches Gatsby plugin processBreadcrumbData)
 * @param {Object[]} data - Raw breadcrumb data from Drupal
 * @returns {Object[]|null} - Processed breadcrumb items or null
 */
const processDrupalBreadcrumbData = (data) => {
  // We want to make sure the data returned has some breadcrumb items.
  // Sometimes Drupal will hand an empty array and that's not what we want to process.
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  let result = [];

  const getParentItem = (item) => {
    result = result.concat({
      text: item.text,
      to: item.to
    });
    if (item.parent && Array.isArray(item.parent) && item.parent.length > 0) {
      getParentItem(item.parent[0]);
    }
  };

  getParentItem(data[0]);

  // Reverse order and add current page to the end (matches Gatsby behavior)
  result = result.reverse();

  return result;
};

/**
 * Find the file entity that corresponds to a media entity
 * @param {Object} mediaEntity - The media entity
 * @param {Array} included - All included entities from the JSON:API response
 * @returns {Object|null} - The matching file entity or null
 */
const findFileEntity = (mediaEntity, included) => {
  // First, find the file entity ID from the media entity's relationships
  const fieldMediaImageRef = mediaEntity?.relationships?.field_media_image?.data;
  if (!fieldMediaImageRef) {
    return null;
  }

  const fileEntityId = fieldMediaImageRef.id;

  // Find the file entity in the included data
  const fileEntity = included?.find((entity) => {
    return entity.type === 'file--file' && entity.id === fileEntityId;
  }
  );

  return fileEntity;
};

/**
 * Generate a complete image URL from a file entity
 * @param {Object} fileEntity - The file entity
 * @param {String} drupalUrl - Base Drupal URL
 * @returns {String} - Complete image URL
 */
const generateImageUrl = (fileEntity, drupalUrl) => {
  if (!fileEntity?.attributes?.uri?.url) {
    return null;
  }

  const fileUrl = fileEntity.attributes.uri.url;

  // If it starts with /, prepend the Drupal base URL
  if (fileUrl.startsWith('/')) {
    return `${drupalUrl}${fileUrl}`;
  }

  // Otherwise return as-is
  return fileUrl;
};

/**
 * Map Drupal design template machine names to Astro template paths
 */
export const getTemplatePath = (machineName) => {
  const templateMap = {
    basic: 'basic',
    homepage: 'home',
    full_width: 'fullwidth',
    landing_page: 'landing',
    section: 'section',
    section_locaside: 'section',
    visit: 'visit',
    destination_body: 'destination-body',
    destination_full: 'destination-full',
    staff_directory: 'staff-directory',
    find_study_space: 'find-study-space',
    floor_plan: 'floor-plan',
    collecting_area: 'collecting-area',
    specialist: 'specialist',
    study_space: 'study-space',
    department: 'department',
    news_landing: 'news-landing',
    news: 'news',
    event_exhibit: 'event'
  };

  return templateMap[machineName] || null;
};

/**
 * Determine tag for a node based on template and node data
 */
export const getTag = (node, template) => {
  if (template === 'department') {
    return 'department';
  }
  if (template === 'news') {
    return 'news';
  }
  // Check for event type
  if (node.relationships?.field_event_type) {
    return node.relationships.field_event_type.name === 'Exhibit' ? 'exhibit' : 'event';
  }
  return null;
};

/**
 * Create breadcrumb from node data
 * Expanded to match Gatsby's breadcrumb logic with Drupal API and parent traversal
 */
export const createBreadcrumb = async (node, allNodes, options = {}) => {
  const {
    enableDrupalFetching = true,
    timeout = 15000, // Increased from 5000ms to 15000ms
    fallbackOnly = false
  } = options;

  // Check if node has Drupal breadcrumb field (like Gatsby plugin did)
  if (!fallbackOnly && enableDrupalFetching && node.attributes?.field_breadcrumb) {
    try {
      const drupalBreadcrumbData = await Promise.race([
        fetchDrupalBreadcrumb(node.attributes.field_breadcrumb),
        new Promise((_, reject) => {
          return setTimeout(() => {
            return reject(new Error('Breadcrumb fetch timeout'));
          }, timeout);
        }
        )
      ]);

      if (drupalBreadcrumbData) {
        const processedBreadcrumb = processDrupalBreadcrumbData(drupalBreadcrumbData);

        if (processedBreadcrumb && processedBreadcrumb.length > 0) {
          return JSON.stringify(processedBreadcrumb);
        }
      }
    } catch (error) {
      // Silently fall back to computed breadcrumb
    }
  }

  // Fall back to building breadcrumb from parent page relationships
  const breadcrumbItems = [{ text: 'Home', to: '/' }];

  // Build parent hierarchy by traversing various parent relationships
  const buildParentChain = (currentNode, visited = new Set()) => {
    // Prevent infinite loops
    if (visited.has(currentNode.id)) {
      return [];
    }
    visited.add(currentNode.id);

    const parents = [];

    // Check for parent page relationship (most common)
    if (currentNode.relationships?.field_parent_page) {
      const parentData = currentNode.relationships.field_parent_page;
      const parentId = parentData.drupal_internal__nid || parentData.id;

      if (allNodes && Array.isArray(allNodes)) {
        const parentNode = allNodes.find((n) => {
          return n.attributes?.drupal_internal__nid === parentId || n.id === parentId;
        }
        );

        if (parentNode) {
          // Recursively get parent's parents
          const grandParents = buildParentChain(parentNode, visited);
          parents.push(...grandParents);

          // Add this parent
          parents.push({
            text: parentNode.attributes?.field_title_context || parentNode.attributes?.title || parentNode.title,
            to: parentNode.attributes?.path?.alias || parentNode.slug || `/${parentNode.attributes?.drupal_internal__nid}`
          });
        }
      }
    }

    // Check for section page parent (alternative parent relationship)
    else if (currentNode.relationships?.field_parent_section) {
      const parentData = currentNode.relationships.field_parent_section;
      const parentId = parentData.drupal_internal__nid || parentData.id;

      if (allNodes && Array.isArray(allNodes)) {
        const parentNode = allNodes.find((n) => {
          return n.attributes?.drupal_internal__nid === parentId || n.id === parentId;
        }
        );

        if (parentNode) {
          const grandParents = buildParentChain(parentNode, visited);
          parents.push(...grandParents);
          parents.push({
            text: parentNode.attributes?.field_title_context || parentNode.attributes?.title || parentNode.title,
            to: parentNode.attributes?.path?.alias || parentNode.slug || `/${parentNode.attributes?.drupal_internal__nid}`
          });
        }
      }
    }

    // Check for building/location parent relationships (for rooms, floors, etc.)
    else if (currentNode.relationships?.field_parent_location) {
      const parentData = currentNode.relationships.field_parent_location;
      const parentId = parentData.drupal_internal__nid || parentData.id;

      if (allNodes && Array.isArray(allNodes)) {
        const parentNode = allNodes.find((n) => {
          return n.attributes?.drupal_internal__nid === parentId || n.id === parentId;
        }
        );

        if (parentNode) {
          const grandParents = buildParentChain(parentNode, visited);
          parents.push(...grandParents);
          parents.push({
            text: parentNode.attributes?.title || parentNode.title,
            to: parentNode.attributes?.path?.alias || parentNode.slug || `/${parentNode.attributes?.drupal_internal__nid}`
          });
        }
      }
    }

    // Check for building parent (for rooms that belong to buildings)
    else if (currentNode.relationships?.field_room_building) {
      const parentData = currentNode.relationships.field_room_building;
      const parentId = parentData.drupal_internal__nid || parentData.id;

      if (allNodes && Array.isArray(allNodes)) {
        const parentNode = allNodes.find((n) => {
          return n.attributes?.drupal_internal__nid === parentId || n.id === parentId;
        }
        );

        if (parentNode) {
          const grandParents = buildParentChain(parentNode, visited);
          parents.push(...grandParents);
          parents.push({
            text: parentNode.attributes?.title || parentNode.title,
            to: parentNode.attributes?.path?.alias || parentNode.slug || `/${parentNode.attributes?.drupal_internal__nid}`
          });
        }
      }
    }

    return parents;
  };

  // Get all parents for this node
  const parents = buildParentChain(node);

  // Add parents to breadcrumb
  breadcrumbItems.push(...parents);

  // Special case: If this is a news story and has no parents, build proper hierarchy
  if (parents.length === 0 && node.type === 'node--news') {
    // Add About Us parent
    breadcrumbItems.push({
      text: 'About Us',
      to: '/about-us'
    });
    // Add News parent
    breadcrumbItems.push({
      text: 'News',
      to: '/about-us/news'
    });
  }

  // Add current page (no 'to' since it's the current page)
  breadcrumbItems.push({
    text: node.attributes?.field_title_context || node.attributes?.title || node.title || 'Page'
  });

  return JSON.stringify(breadcrumbItems);
};

/**
 * Process Drupal JSON:API node into a page-ready format
 */
export const processDrupalNode = (node, included = []) => {
  // Helper function to recursively process relationships at any depth
  const processRelationships = (item, depth = 0, maxDepth = 4) => {
    if (!item || !item.relationships || depth >= maxDepth) {
      return {};
    }

    const relationships = {};
    Object.keys(item.relationships).forEach((key) => {
      const relationship = item.relationships[key];
      if (!relationship || !relationship.data) {
        return;
      }

      if (Array.isArray(relationship.data)) {
        // Handle array relationships
        relationships[key] = relationship.data.map((relData) => {
          const relatedItem = included.find((includedItem) => {
            return includedItem.id === relData.id && includedItem.type === relData.type;
          });
          if (!relatedItem) {
            return null;
          }

          // Create slug from path.alias (matching Gatsby's fields structure)
          const slug = relatedItem.attributes?.path?.alias || `/${relatedItem.attributes?.drupal_internal__nid || relatedItem.id}`;

          return {
            __typename: relatedItem.type,
            id: relatedItem.id,
            ...relatedItem.attributes,
            // Add fields object to match Gatsby structure
            fields: {
              slug,
              title: relatedItem.attributes?.title
            },
            slug, // Also add slug at top level for convenience
            relationships: processRelationships(relatedItem, depth + 1, maxDepth)
          };
        }).filter(Boolean);
      } else {
        // Handle single relationships
        const relatedItem = included.find((includedItem) => {
          return includedItem.id === relationship.data.id && includedItem.type === relationship.data.type;
        });
        if (relatedItem) {
          // Create slug from path.alias (matching Gatsby's fields structure)
          const slug = relatedItem.attributes?.path?.alias || `/${relatedItem.attributes?.drupal_internal__nid || relatedItem.id}`;

          relationships[key] = {
            __typename: relatedItem.type,
            id: relatedItem.id,
            ...relatedItem.attributes,
            // Add fields object to match Gatsby structure
            fields: {
              slug,
              title: relatedItem.attributes?.title
            },
            slug, // Also add slug at top level for convenience
            relationships: processRelationships(relatedItem, depth + 1, maxDepth)
          };
        }
      }
    });
    return relationships;
  };

  // Process all top-level relationships
  const relationships = processRelationships(node);

  // Special handling for top-level field_media_image (e.g. news, events)
  // Resolves the file URL and image meta from the media entity + included data
  if (node.relationships?.field_media_image?.data) {
    const mediaRef = node.relationships.field_media_image.data;
    const mediaEntity = included.find((item) => {
      return item.type === mediaRef.type && item.id === mediaRef.id;
    });
    if (mediaEntity) {
      const fileRef = mediaEntity.relationships?.field_media_image?.data;
      const fileEntity = fileRef
        ? included.find((item) => {
            return item.type === 'file--file' && item.id === fileRef.id;
          })
        : null;
      const imageUrl = generateImageUrl(fileEntity, process.env.DRUPAL_URL || 'https://cms.lib.umich.edu');
      relationships.field_media_image = {
        ...relationships.field_media_image,
        imageUrl,
        imageAlt: fileRef?.meta?.alt || '',
        imageWidth: fileRef?.meta?.width || null,
        imageHeight: fileRef?.meta?.height || null,
        imageCaption: mediaEntity.attributes?.field_image_caption?.processed || null
      };
    }
  }

  // Special handling for hero panels and card panels to enhance images with file URLs
  if (relationships.field_panels) {
    const drupalBaseUrl = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu';

    relationships.field_panels = relationships.field_panels.map((panel) => {
      if (panel.__typename === 'paragraph--hero_panel' && panel.relationships?.field_hero_images) {
        panel.relationships.field_hero_images = panel.relationships.field_hero_images.map((img) => {
          const mediaEntity = included.find((item) => {
            return item.type === 'media--image'
              && item.attributes?.drupal_internal__mid === img.drupal_internal__mid;
          });

          if (mediaEntity) {
            const fileEntity = findFileEntity(mediaEntity, included);
            const imageUrl = generateImageUrl(fileEntity, drupalBaseUrl);

            return {
              ...img,
              fileUrl: imageUrl,
              fileEntity: fileEntity?.attributes
            };
          }

          return img;
        });
      }

      // Enrich card panel card images with resolved URLs
      if (panel.__typename === 'paragraph--card_panel' && Array.isArray(panel.relationships?.field_cards)) {
        panel.relationships.field_cards = panel.relationships.field_cards.map((card) => {
          const mediaEntity = card.relationships?.field_media_image;
          if (!mediaEntity) {
            return card;
          }
          // processRelationships() spreads file entity attributes, so uri.url is top-level
          const fileEntity = mediaEntity.relationships?.field_media_image;
          const rawUrl = fileEntity?.uri?.url;
          if (!rawUrl) {
            return card;
          }
          const imageUrl = rawUrl.startsWith('/') ? `${drupalBaseUrl}${rawUrl}` : rawUrl;
          // field_media_image attribute on media--image entity holds alt/width/height
          const imageAlt = mediaEntity.field_media_image?.alt || '';

          return {
            ...card,
            relationships: {
              ...card.relationships,
              field_media_image: {
                ...mediaEntity,
                imageUrl,
                imageAlt
              }
            }
          };
        });
      }

      return panel;
    });
  }

  return {
    id: node.id,
    type: node.type,
    attributes: node.attributes,
    relationships,
    // Add common computed fields
    slug: node.attributes.path?.alias || `/${node.attributes.drupal_internal__nid}`,
    title: node.attributes.title,
    drupal_internal__nid: node.attributes.drupal_internal__nid,
    links: node.links
  };
};

// cache pages on build for 5 minutes. To be replaced with AStro's Content Layer API
let _pagesCache = null;
let _pagesCacheTimestamp = 0;
const PAGES_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes in dev

/**
 * Get all pages that should be generated
 * This is the Astro equivalent of your Gatsby GraphQL query + createPages
 */
export const getPagesToGenerate = async () => {
  const isDev = import.meta.env?.DEV ?? (process.env.NODE_ENV !== 'production');
  if (isDev && _pagesCache && (Date.now() - _pagesCacheTimestamp < PAGES_CACHE_TTL_MS)) {
    return _pagesCache;
  }

  // Fetch all content types from Drupal (like your GraphQL query)
  const [pages, sections, buildings, rooms, locations, floorPlans, departments, news, events] = await Promise.all([
    fetchDrupalPages(),
    fetchDrupalSectionPages(),
    fetchDrupalBuildings(),
    fetchDrupalRooms(),
    fetchDrupalLocations(),
    fetchDrupalFloorPlans(),
    fetchDrupalDepartments(),
    fetchDrupalNews(),
    fetchDrupalEvents()
  ]);

  // Combine all nodes (like your edges.concat in Gatsby)
  const allNodes = [
    ...(pages.data || []),
    ...(sections.data || []),
    ...(buildings.data || []),
    ...(rooms.data || []),
    ...(locations.data || []),
    ...(floorPlans.data || []),
    ...(departments.data || []),
    ...(news.data || []),
    ...(events.data || [])
  ];

  // Combine all included relationship data
  const included = [
    ...(pages.included || []),
    ...(sections.included || []),
    ...(buildings.included || []),
    ...(rooms.included || []),
    ...(locations.included || []),
    ...(floorPlans.included || []),
    ...(departments.included || []),
    ...(news.included || []),
    ...(events.included || [])
  ];

  const processedNodes = allNodes
    .map((node) => {
      return processDrupalNode(node, included);
    })
    .filter((node) => {
      return node.relationships.field_design_template;
    });

  const floorPlanNodes = processedNodes.filter((node) => {
    return node.type === 'node--floor_plan';
  });

  processedNodes.forEach((node) => {
    if (node.type === 'node--page' || node.type === 'node--floor_plan' || node.type === 'node--section_page') {
      return;
    }
    const building = node.relationships.field_room_building;
    const parentLocation = node.relationships.field_parent_location;
    const bid = building?.id ?? parentLocation?.id;
    const fid = node.relationships.field_floor?.id;
    if (!bid || !fid) {
      return;
    }
    const match = floorPlanNodes.find((fp) => {
      const fpBuilding = fp.relationships?.field_room_building;
      const fpFloor = fp.relationships?.field_floor;
      return fpBuilding?.id === bid && fpFloor?.id === fid;
    });
    if (match) {
      node.relationships.field_floor_plan = {
        ...(match.attributes || {}),
        id: match.id,
        __typename: match.type,
        fields: {
          slug: match.slug,
          title: match.title
        },
        slug: match.slug,
        relationships: match.relationships
      };
    }
  });

  // Generate final page data with breadcrumbs.
  // Process in batches of 20 to avoid overwhelming Drupal with concurrent requests
  // (matches the concurrency limit used by the original Gatsby plugin).
  const BREADCRUMB_BATCH_SIZE = 20;
  const breadcrumbOptions = {
    enableDrupalFetching: process.env.ENABLE_DRUPAL_BREADCRUMBS !== 'false',
    timeout: parseInt(process.env.BREADCRUMB_TIMEOUT || '15000'),
    fallbackOnly: process.env.BREADCRUMB_FALLBACK_ONLY === 'true'
  };

  const pagesWithBreadcrumbs = [];
  for (let i = 0; i < processedNodes.length; i += BREADCRUMB_BATCH_SIZE) {
    const batch = processedNodes.slice(i, i + BREADCRUMB_BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (node) => {
        const machineName = node.relationships.field_design_template.field_machine_name;
        const template = getTemplatePath(machineName);
        const tag = getTag(node, template);
        const summary = node.attributes.body?.summary || null;
        const keywords = node.attributes.field_seo_keywords || '';
        const breadcrumb = await createBreadcrumb(node, processedNodes, breadcrumbOptions);

        // Fetch parent/child menu ordering from Drupal custom view endpoints
        const menuData = await fetchMenuOrderData(node);
        const parentNodes = resolveMenuNodes(menuData.parentIds, processedNodes, 'node--section_page');
        const childNodes = resolveMenuNodes(menuData.childIds, processedNodes, 'node--section_page');

        return {
          slug: node.slug,
          node,
          template,
          drupal_nid: node.drupal_internal__nid,
          title: node.title,
          breadcrumb,
          summary,
          keywords,
          tag,
          parents: parentNodes,
          children: childNodes,
          parentIds: menuData.parentIds,
          childIds: menuData.childIds
        };
      })
    );
    pagesWithBreadcrumbs.push(...batchResults);
  }

  const result = pagesWithBreadcrumbs.filter((page) => {
    return page.template !== null;
  });

  // Store in cache for dev mode reuse
  _pagesCache = result;
  _pagesCacheTimestamp = Date.now();

  return result;
};
