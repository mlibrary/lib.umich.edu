/**
 * Astro Page Generator - Replacement for Gatsby's createPages API
 *
 * This module helps generate dynamic pages from Drupal data
 */

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
      if (!Array.isArray(relationship.data)) {
        const relatedItem = included.find((item) => {
          return item.id === relationship.data.id && item.type === relationship.data.type;
        });
        if (relatedItem) {
          relationships[key] = relatedItem.attributes;
        }
      } else {
        // Handle multiple relationships
        relationships[key] = relationship.data.map((relData) => {
          const relatedItem = included.find((item) => {
            return item.id === relData.id && item.type === relData.type;
          });
          return relatedItem ? relatedItem.attributes : null;
        }).filter(Boolean);
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
    drupal_internal__nid: node.attributes.drupal_internal__nid
  };
};

/**
 * Get all pages that should be generated
 */
export const getPagesToGenerate = (nodes, included = []) => {
  return nodes
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

      return {
        ...node,
        template,
        tag
      };
    })
    .filter((page) => {
      return page.template !== null;
    });
};
