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
 */
export const createBreadcrumb = (node, allNodes) => {
  // This will be implemented based on your breadcrumb logic
  // For now, return a basic structure
  const breadcrumb = [];

  // Add logic to traverse parent nodes and build breadcrumb
  // Based on node.fields.parents

  return breadcrumb;
};

/**
 * Process Drupal JSON:API node into a page-ready format
 */
export const processDrupalNode = (node, included = []) => {
  // Extract relationships from included data
  const relationships = {};

  if (node.relationships) {
    Object.keys(node.relationships).forEach((key) => {
      const relationship = node.relationships[key];

      if (!relationship || !relationship.data) {
        return;
      }

      // Handle single relationship
      if (Array.isArray(relationship.data)) {
        // Handle multiple relationships (like panels)
        relationships[key] = relationship.data.map((relData) => {
          const relatedItem = included.find((item) => {
            return item.id === relData.id && item.type === relData.type;
          });
          if (relatedItem) {
            // Process nested relationships recursively
            const nestedRelationships = {};
            if (relatedItem.relationships) {
              Object.keys(relatedItem.relationships).forEach((nestedKey) => {
                const nestedRel = relatedItem.relationships[nestedKey];
                if (!nestedRel || !nestedRel.data) {
                  return;
                }

                if (Array.isArray(nestedRel.data)) {
                  // Handle nested array relationships
                  nestedRelationships[nestedKey] = nestedRel.data.map((nestedRelData) => {
                    const nestedItem = included.find((item) => {
                      return item.id === nestedRelData.id && item.type === nestedRelData.type;
                    });
                    return nestedItem ? { ...nestedItem.attributes, __typename: nestedItem.type } : null;
                  }).filter(Boolean);
                } else {
                  // Handle single nested relationships
                  const nestedItem = included.find((item) => {
                    return item.id === nestedRel.data.id && item.type === nestedRel.data.type;
                  });
                  if (nestedItem) {
                    nestedRelationships[nestedKey] = nestedItem.attributes;
                  }
                }
              });
            }

            // For panels and other array relationships, preserve the full structure
            // With __typename for component routing
            const processedItem = {
              __typename: relatedItem.type,
              id: relatedItem.id,
              ...relatedItem.attributes,
              relationships: nestedRelationships
            };

            // Enhance hero panels with file entity data
            if (relatedItem.type === 'paragraph--hero_panel') {
              // Enhance hero images with file entity data
              if (nestedRelationships.field_hero_images) {
                nestedRelationships.field_hero_images = nestedRelationships.field_hero_images.map((img, idx) => {
                  // Find the original media entity to get relationships
                  const mediaEntity = included.find((item) => {
                    return item.type === 'media--image'
                      && item.attributes?.drupal_internal__mid === img.drupal_internal__mid;
                  }
                  );

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
            }

            return processedItem;
          }
          return null;
        }).filter(Boolean);
      } else {
        const relatedItem = included.find((item) => {
          return item.id === relationship.data.id && item.type === relationship.data.type;
        });
        if (relatedItem) {
          relationships[key] = relatedItem.attributes;
        }
      }
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
    // Preserve included data for components that need it
    included: included
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
  return allNodes
    .map((node) => {
      return processDrupalNode(node, included);
    })
    .filter((node) => {
      // Filter out nodes without a design template
      return node.relationships.field_design_template;
    })
    .map((node) => {
      const machineName = node.relationships.field_design_template.field_machine_name;
      const template = getTemplatePath(machineName);
      const tag = getTag(node, template);
      const summary = node.attributes.body?.summary || null;
      const keywords = node.attributes.field_seo_keywords || '';

      return {
        slug: node.slug,
        node,
        template,
        drupal_nid: node.drupal_internal__nid,
        title: node.title,
        breadcrumb: [],
        summary,
        keywords,
        tag,
        parents: [],
        children: []
      };
    })
    .filter((page) => {
      return page.template !== null;
    });
};
