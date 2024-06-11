export default function getNode (nodes) {
  const nodeTypes = Object.keys(nodes);
  const nodeType = nodeTypes.find((type) => {
    return nodes[type];
  });
  const node = nodes[nodeType];

  return node;
}
