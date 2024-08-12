import orderNodes from './order-nodes';

const createNavItem = (node) => {
  return {
    text: node.field_title_context,
    to: node.fields.slug
  };
};
const createNavItems = (firstNode, orderedIds, nodes) => {
  const nodesOrdered = orderNodes(orderedIds, nodes).filter((node) => {
    return typeof node !== 'undefined';
  });

  return []
    .concat(createNavItem(firstNode))
    .concat(nodesOrdered.map(({ node }) => {
      return createNavItem(node);
    }));
};

export default function processHorizontalNavigationData ({
  parentNodeOrderByDrupalId,
  parentNodes,
  childrenNodeOrderByDrupalId,
  childrenNodes,
  isRootPage,
  parentNode,
  currentNode
}) {
  /*
   *If it's the root page, then use children data,
   *not parent data.
   */
  if (isRootPage) {
    return createNavItems(
      currentNode,
      childrenNodeOrderByDrupalId,
      childrenNodes
    );
  }

  return createNavItems(parentNode, parentNodeOrderByDrupalId, parentNodes);
}
