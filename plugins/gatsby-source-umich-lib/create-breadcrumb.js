const { fetch } = require('./fetch');

// Breadcumb
// If the page has a breadcrumb, fetch it and store it as 'breadcrumb' field.
const processBreadcrumbData = ({ data }) => {
  // We want to make sure the data returned has some breadcrumb items.
  // Sometimes Drupal will hand an empty array and that's
  // Not what we want to process.
  if (data.length) {
    let result = [];
    const getParentItem = (item) => {
      result = result.concat({
        text: item.text,
        to: item.to
      });
      if (item.parent) {
        getParentItem(item.parent[0]);
      }
    };
    getParentItem(data[0]);

    // Reverse order and add current page to the end.
    result = result.reverse();

    return result;
  }

  return null;
};

const createBreadcrumb = async ({ node, createNodeField, baseUrl }) => {
  const createBreadcrumbNodeField = (value) => {
    createNodeField({
      name: `breadcrumb`,
      node,
      value: JSON.stringify(value)
    });
  };

  const createDefaultBreadcrumb = () => {
    const defaultBreadcrumb = [{ text: 'Home', to: '/' }, { text: node.title }];

    createBreadcrumbNodeField(defaultBreadcrumb);
  };

  if (node.field_breadcrumb) {
    const data = await fetch(baseUrl + node.field_breadcrumb);
    const breadcrumb = processBreadcrumbData({ data, node });

    if (breadcrumb) {
      createBreadcrumbNodeField(breadcrumb);
    } else {
      createDefaultBreadcrumb();
    }
  } else {
    createDefaultBreadcrumb();
  }
};

exports.createBreadcrumb = createBreadcrumb;
