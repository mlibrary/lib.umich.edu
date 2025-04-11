import { visit } from 'unist-util-visit';

export default function rehypeDrupalEntity () {
  return function transformer (tree) {
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'div'
        && node.properties?.dataEntityType === 'media'
        && node.properties?.dataEntityUuid
      ) {
        node.tagName = 'drupal-entity';
      }
    });
  };
}
