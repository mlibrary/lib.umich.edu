const fetch = require("node-fetch")

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
    result = result.reverse()

    return result
  }

  return null
}

async function createBreadcrumb({
  node,
  createNodeField,
  baseUrl
}) {
  function createBreadcrumbNodeField(value) {
    createNodeField({
      node,
      name: `breadcrumb`,
      value: JSON.stringify(value)
    })
  }

  function createDefaultBreadcrumb() {
    const defaultBreadcrumb = [
      { text: 'Home', to: "/",  },
      { text: node.title }
    ]

    createBreadcrumbNodeField(defaultBreadcrumb)
  }

  if (node.field_breadcrumb) {
    const response = await fetch(baseUrl + node.field_breadcrumb)
    const data = await response.json()
    const breadcrumb = processBreadcrumbData({ node, data })

    if (breadcrumb) {
      createBreadcrumbNodeField(breadcrumb)
    } else {
      createDefaultBreadcrumb()
    }
  } else {
    createDefaultBreadcrumb()
  }
}

exports.createBreadcrumb = createBreadcrumb