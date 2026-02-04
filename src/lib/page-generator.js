/**
 * Astro Page Generator - Replacement for Gatsby's createPages API
 *
 * This module helps generate dynamic pages from Drupal data
 */
import {
  fetchDrupalBuildings,
  fetchDrupalEvents,
  fetchDrupalNews,
  fetchDrupalPages,
  fetchDrupalSectionPages
} from './drupal.js';

/**
 * Fetch breadcrumb data from Drupal API (matches Gatsby plugin behavior)
 * @param {string} breadcrumbUrl - The breadcrumb API endpoint URL
 * @returns {Promise<Object[]|null>} - Breadcrumb data or null if fetch fails
 */
const fetchDrupalBreadcrumb = async (breadcrumbUrl) => {
  try {
    const baseUrl = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu';
    const fullUrl = breadcrumbUrl.startsWith('http') ? breadcrumbUrl : `${baseUrl}${breadcrumbUrl}`;

    const response = await fetch(fullUrl);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
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

          return {
            __typename: relatedItem.type,
            id: relatedItem.id,
            ...relatedItem.attributes,
            relationships: processRelationships(relatedItem, depth + 1, maxDepth)
          };
        }).filter(Boolean);
      } else {
        // Handle single relationships
        const relatedItem = included.find((includedItem) => {
          return includedItem.id === relationship.data.id && includedItem.type === relationship.data.type;
        });
        if (relatedItem) {
          relationships[key] = {
            __typename: relatedItem.type,
            id: relatedItem.id,
            ...relatedItem.attributes,
            relationships: processRelationships(relatedItem, depth + 1, maxDepth)
          };
        }
      }
    });
    return relationships;
  };

  // Process all top-level relationships
  const relationships = processRelationships(node);

  // Special handling for hero panels to enhance images with file URLs
  if (relationships.field_panels) {
    relationships.field_panels = relationships.field_panels.map((panel) => {
      if (panel.__typename === 'paragraph--hero_panel' && panel.relationships?.field_hero_images) {
        panel.relationships.field_hero_images = panel.relationships.field_hero_images.map((img) => {
          const mediaEntity = included.find((item) => {
            return item.type === 'media--image'
              && item.attributes?.drupal_internal__mid === img.drupal_internal__mid;
          });

          if (mediaEntity) {
            const fileEntity = findFileEntity(mediaEntity, included);
            const imageUrl = generateImageUrl(fileEntity, process.env.DRUPAL_URL || 'https://cms.lib.umich.edu');

            return {
              ...img,
              fileUrl: imageUrl,
              fileEntity: fileEntity?.attributes
            };
          }

          return img;
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

/**
 * Get all pages that should be generated
 * This is the Astro equivalent of your Gatsby GraphQL query + createPages
 */
export const getPagesToGenerate = async () => {
  // Fetch all content types from Drupal (like your GraphQL query)
  const [pages, sections, buildings, news, events] = await Promise.all([
    fetchDrupalPages(),
    fetchDrupalSectionPages(),
    fetchDrupalBuildings(),
    fetchDrupalNews(),
    fetchDrupalEvents()
  ]);

  // Combine all nodes (like your edges.concat in Gatsby)
  const allNodes = [
    ...(pages.data || []),
    ...(sections.data || []),
    ...(buildings.data || []),
    ...(news.data || []),
    ...(events.data || [])
  ];

  // Combine all included relationship data
  const included = [
    ...(pages.included || []),
    ...(sections.included || []),
    ...(buildings.included || []),
    ...(news.included || []),
    ...(events.included || [])
  ];

  // Process each node and generate page data
  const processedNodes = allNodes
    .map((node) => {
      return processDrupalNode(node, included);
    })
    .filter((node) => {
      // Filter out nodes without a design template
      return node.relationships.field_design_template;
    });

  // Generate final page data with breadcrumbs
  const pagesWithBreadcrumbs = await Promise.all(
    processedNodes.map(async (node) => {
      const machineName = node.relationships.field_design_template.field_machine_name;
      const template = getTemplatePath(machineName);
      const tag = getTag(node, template);
      const summary = node.attributes.body?.summary || null;
      const keywords = node.attributes.field_seo_keywords || '';

      // Await breadcrumb creation since it's now async
      const breadcrumbOptions = {
        enableDrupalFetching: process.env.ENABLE_DRUPAL_BREADCRUMBS !== 'false',
        timeout: parseInt(process.env.BREADCRUMB_TIMEOUT || '15000'), // Increased default
        fallbackOnly: process.env.BREADCRUMB_FALLBACK_ONLY === 'true'
      };
      const breadcrumb = await createBreadcrumb(node, processedNodes, breadcrumbOptions);

      return {
        slug: node.slug,
        node,
        template,
        drupal_nid: node.drupal_internal__nid,
        title: node.title,
        breadcrumb, // Now contains the awaited breadcrumb result
        summary,
        keywords,
        tag,
        parents: [],
        children: []
      };
    })
  );

  return pagesWithBreadcrumbs.filter((page) => {
    return page.template !== null;
  });
};
