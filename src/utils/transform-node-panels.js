export default function transformNodePanels({ node }) {
  const data = node.relationships.field_panels
    ? node.relationships.field_panels
    : [];

  return {
    bodyPanels: data.filter((panel) => panel.field_placement === 'body'),
    fullPanels: data.filter((panel) => panel.field_placement !== 'body'),
  };
}
