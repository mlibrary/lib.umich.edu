const fetch = require("fetch-retry")

// Breadcumb
// If the page has a breadcrumb, fetch it and store it as 'breadcrumb' field.
function processBreadcrumbData({
  node,
  data
}) {
  // We want to make sure the data returned has some breadcrumb items.
  // Sometimes Drupal will hand an empty array and that's
  // not what we want to process.
  if (data.length) {
    let result = []
    function getParentItem(item) {
      result = result.concat({
        to: item.to,
        text: item.text
      })
      if (item.parent) {
        getParentItem(item.parent[0])
      }
    }
    getParentItem(data[0])

    // Reverse order and add current page to the end.
    result = result.reverse().concat({ text: node.title })

    return result
  }

  return null
}

function createBreadcrumb({
  node,
  createNodeField,
  baseUrl
}) {
  function createDefaultBreadcrumb() {
    const defaultBreadcrumb = [
      { text: 'Home', to: "/",  },
      { text: node.title }
    ]

    createNodeField({
      node,
      name: `breadcrumb`,
      value: JSON.stringify(defaultBreadcrumb)
    })
  }

  if (node.field_breadcrumb) {
    fetch(baseUrl + node.field_breadcrumb, {
      retries: 5,
      retryDelay: 2500
    })
      .catch(err => console.error(err))
      .then(response => response.json())
      .then(data => {
        const breadcrumb = processBreadcrumbData({ node, data })

        createNodeField({
          node,
          name: `breadcrumb`,
          value: breadcrumb ? JSON.stringify(breadcrumb) : null
        })
      })
  } else {
    createDefaultBreadcrumb()
  }
}

exports.createBreadcrumb = createBreadcrumb