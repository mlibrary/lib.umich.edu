/*
 *We need to reorder the nodes by Drupal uuids that
 *are listed in `order`.
 *
 *This maintains the child/parent order menu system
 *that content editors set in the CMS.
 */
export default function OrderNodes (order, nodes) {
  return order.map((id) => {
    return nodes.find(({ node }) => {
      return node.drupal_id === id;
    });
  });
}
