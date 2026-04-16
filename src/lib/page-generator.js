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
 * @param {string} breadcrumbUrl
 * @returns {Promise<Object[]|null>}
 */
const fetchDrupalBreadcrumb = async (breadcrumbUrl) => {
  try {
    const baseUrl = (process.env.DRUPAL_URL || 'https://cms.lib.umich.edu').replace(/\/$/u, '');
    const path = breadcrumbUrl.startsWith('http')
      ? breadcrumbUrl.replace(baseUrl, '')
      : breadcrumbUrl;
    return await fetchFromDrupal(path);
  } catch (error) {
    return null;
  }
};


const sanitizeDrupalView = (data) => {
  if (Array.isArray(data)) {
    if (data[0] && !Array.isArray(data[0])) {
      return data;
    }
  }
  return null;
};

/**
 * @param {Object} node
 * @returns {Promise<{parentIds: string[], childIds: string[]}>}
 */
const fetchMenuOrderData = async (node) => {
  const attrs = node.attributes || {};
  const result = { childIds: [], parentIds: [] };

  if (!attrs.field_parent_menu && !attrs.field_child_menu) {
    return result;
  }

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

  // Fetch both in parallel instead of sequentially
  const [parentIds, childIds] = await Promise.all([
    fetchMenuField(attrs.field_parent_menu),
    fetchMenuField(attrs.field_child_menu)
  ]);
  result.parentIds = parentIds;
  result.childIds = childIds;

  return result;
};

/**
 * @param {string[]} uuids
 * @param {Object[]} allProcessedNodes
 * @param {string} [nodeType] 
 * @returns {Object[]} 
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
 * @param {Object[]} data - Raw breadcrumb data from Drupal
 * @returns {Object[]|null} - Processed breadcrumb items or null
 */
const processDrupalBreadcrumbData = (data) => {
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

  result = result.reverse();

  return result;
};

/**
 * @param {Object} mediaEntity
 * @param {Array} included
 * @returns {Object|null}
 */
const findFileEntity = (mediaEntity, included) => {
  const fieldMediaImageRef = mediaEntity?.relationships?.field_media_image?.data;
  if (!fieldMediaImageRef) {
    return null;
  }

  const fileEntityId = fieldMediaImageRef.id;

  const fileEntity = included?.find((entity) => {
    return entity.type === 'file--file' && entity.id === fileEntityId;
  }
  );

  return fileEntity;
};

/**
 * @param {Object} fileEntity
 * @param {String} drupalUrl
 * @returns {String}
 */
const generateImageUrl = (fileEntity, drupalUrl) => {
  if (!fileEntity?.attributes?.uri?.url) {
    return null;
  }

  const fileUrl = fileEntity.attributes.uri.url;

  if (fileUrl.startsWith('/')) {
    return `${drupalUrl}${fileUrl}`;
  }

  return fileUrl;
};


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

export const getTag = (node, template) => {
  if (template === 'department') {
    return 'department';
  }
  if (template === 'news') {
    return 'news';
  }
  if (node.relationships?.field_event_type) {
    return node.relationships.field_event_type.name === 'Exhibit' ? 'exhibit' : 'event';
  }
  return null;
};


export const createBreadcrumb = async (node, allNodes, options = {}) => {
  const {
    enableDrupalFetching = true,
    timeout = 15000,
    fallbackOnly = false
  } = options;

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
    }
  }

  const breadcrumbItems = [{ text: 'Home', to: '/' }];

  const buildParentChain = (currentNode, visited = new Set()) => {
    if (visited.has(currentNode.id)) {
      return [];
    }
    visited.add(currentNode.id);

    const parents = [];

    if (currentNode.relationships?.field_parent_page) {
      const parentData = currentNode.relationships.field_parent_page;
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

  const parents = buildParentChain(node);

  breadcrumbItems.push(...parents);

  if (parents.length === 0 && node.type === 'node--news') {
    breadcrumbItems.push({
      text: 'About Us',
      to: '/about-us'
    });
    breadcrumbItems.push({
      text: 'News',
      to: '/about-us/news'
    });
  }

  breadcrumbItems.push({
    text: node.attributes?.field_title_context || node.attributes?.title || node.title || 'Page'
  });

  return JSON.stringify(breadcrumbItems);
};

export const processDrupalNode = (node, included = []) => {
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
        relationships[key] = relationship.data.map((relData) => {
          const relatedItem = included.find((includedItem) => {
            return includedItem.id === relData.id && includedItem.type === relData.type;
          });
          if (!relatedItem) {
            return null;
          }

          const slug = relatedItem.attributes?.path?.alias || `/${relatedItem.attributes?.drupal_internal__nid || relatedItem.id}`;

          return {
            __typename: relatedItem.type,
            id: relatedItem.id,
            ...relatedItem.attributes,
            fields: {
              slug,
              title: relatedItem.attributes?.title
            },
            slug,
            relationships: processRelationships(relatedItem, depth + 1, maxDepth)
          };
        }).filter(Boolean);
      } else {
        const relatedItem = included.find((includedItem) => {
          return includedItem.id === relationship.data.id && includedItem.type === relationship.data.type;
        });
        if (relatedItem) {
          const slug = relatedItem.attributes?.path?.alias || `/${relatedItem.attributes?.drupal_internal__nid || relatedItem.id}`;

          relationships[key] = {
            __typename: relatedItem.type,
            id: relatedItem.id,
            ...relatedItem.attributes,
            fields: {
              slug,
              title: relatedItem.attributes?.title
            },
            slug,
            relationships: processRelationships(relatedItem, depth + 1, maxDepth)
          };
        }
      }
    });
    return relationships;
  };

  const relationships = processRelationships(node);

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

      if (panel.__typename === 'paragraph--card_panel' && Array.isArray(panel.relationships?.field_cards)) {
        panel.relationships.field_cards = panel.relationships.field_cards.map((card) => {
          const mediaEntity = card.relationships?.field_media_image;
          if (!mediaEntity) {
            return card;
          }
          const fileEntity = mediaEntity.relationships?.field_media_image;
          const rawUrl = fileEntity?.uri?.url;
          if (!rawUrl) {
            return card;
          }
          const imageUrl = rawUrl.startsWith('/') ? `${drupalBaseUrl}${rawUrl}` : rawUrl;
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
    slug: node.attributes.path?.alias || `/${node.attributes.drupal_internal__nid}`,
    title: node.attributes.title,
    drupal_internal__nid: node.attributes.drupal_internal__nid,
    links: node.links
  };
};

let _pagesCache = null;
let _pagesCacheTimestamp = 0;
const PAGES_CACHE_TTL_MS = 5 * 60 * 1000; 

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const PROJECT_ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..', '..');
const CACHE_DIR = path.join(PROJECT_ROOT, '.astro');
const CACHE_FILE = path.join(CACHE_DIR, 'drupal-pages-cache.json');

const readPersistentCache = () => {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.pages) || !parsed.timestamp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

// file based caching
const writePersistentCache = (pages) => {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      pages,
      timestamp: Date.now(),
      count: pages.length
    }));
  } catch (err) {
    console.warn('[page-generator] Failed to write persistent cache:', err.message);
  }
};


export const getPagesToGenerate = async () => {
  const isDev = import.meta.env?.DEV ?? (process.env.NODE_ENV !== 'production');
  const forceRefresh = process.env.DRUPAL_FORCE_REFRESH === 'true';

  if (!forceRefresh && isDev && _pagesCache && (Date.now() - _pagesCacheTimestamp < PAGES_CACHE_TTL_MS)) {
    return _pagesCache;
  }

  if (!forceRefresh && isDev) {
    const cached = readPersistentCache();
    if (cached) {
      console.log(`[page-generator] Using persistent cache (${cached.count} pages from ${new Date(cached.timestamp).toLocaleTimeString()})`);
      _pagesCache = cached.pages;
      _pagesCacheTimestamp = Date.now();
      return cached.pages;
    }
  }

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

  const included = [
    ...allNodes,
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

  const BREADCRUMB_BATCH_SIZE = 50;
  const breadcrumbOptions = {
    enableDrupalFetching: false,
    timeout: parseInt(process.env.BREADCRUMB_TIMEOUT || '15000'),
    fallbackOnly: true
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

  _pagesCache = result;
  _pagesCacheTimestamp = Date.now();

  if (isDev) {
    writePersistentCache(result);
    console.log(`[page-generator] Wrote persistent cache (${result.length} pages)`);
  }

  return result;
};
