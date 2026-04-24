import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data';

/**
 * Build horizontal navigation items from node data.
 *
 * Wraps processHorizontalNavigationData with the Astro data-shape
 * conversions so every template can call a single helper instead
 * of duplicating the same adapter code.
 *
 * @param {Object}   options
 * @param {Object}   options.node       – The processed Astro page node
 * @param {boolean}  options.isRootPage  – Whether the current page is the root
 * @param {Object}   [options.parentNode]  – First parent page (from node.relationships.field_parent_page[0])
 * @param {string[]} [options.parentIds]   – Ordered Drupal UUIDs for parent siblings
 * @param {Object[]} [options.parents]     – Resolved parent edges [{node: {…}}, …]
 * @param {string[]} [options.childIds]    – Ordered Drupal UUIDs for child pages
 * @param {Object[]} [options.children]    – Resolved child edges [{node: {…}}, …]
 * @returns {Array<{text: string, to: string}>}
 */
export default function buildHorizontalNavigation ({
  node,
  isRootPage,
  parentNode,
  parentIds = [],
  parents = [],
  childIds = [],
  children = []
}) {
  // currentNode needs field_title_context and fields.slug to match
  // the shape that processHorizontalNavigationData / orderNodes expect.
  const currentNode = {
    field_title_context: node.attributes?.field_title_context || node.attributes?.title || node.title,
    fields: { slug: node.slug || node.attributes?.path?.alias }
  };

  const parentNodeNav = parentNode
    ? {
        field_title_context: parentNode.field_title_context || parentNode.title,
        fields: { slug: parentNode.fields?.slug || parentNode.slug }
      }
    : null;

  return processHorizontalNavigationData({
    childrenNodeOrderByDrupalId: childIds,
    childrenNodes: children,
    currentNode,
    isRootPage,
    parentNode: parentNodeNav,
    parentNodeOrderByDrupalId: parentIds,
    parentNodes: parents
  });
}
