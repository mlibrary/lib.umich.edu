const path = require(`path`)
const fetch = require("fetch-retry")
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

function removeTrailingSlash(s) {
  return s.replace(/\/$/, "");
}

/*
  Custom Drupal APIs created with Drupal views
  can make "empty" results of varying nested
  levels of arrays.

  This is to check if the returned data
  has values or is empty with all the potential
  nested empty arrays.

  [ [ [] ] ]
*/
function sanitizeDrupalView(data) {
  // Everything is wrapped in an array because Drupal views.
  if (Array.isArray(data)) {

    // We're looking for objects {}. If it's not an array
    // Let's assume it's an object with values.
    if (data[0] && !Array.isArray(data[0])) {
      return data
    }
  }

  return null
}

/*
  sourceNodes is only called once per plugin by Gatsby.
*/
exports.sourceNodes = async (
  {
    actions,
    createContentDigest
  },
  {
    baseUrl
  }
) => {
  const { createNode } = actions
  /*
      Transform Drupal data and make a list of this shape:
      {
        text: 'Some page title',
        description: 'a string that describes the item',
        to: '/to-the/thing',
        children: [... more of these objects],
      }
    */
  function processDrupalNavData(data) {
    return data.map(item => {
      let navItem = {
        text: item.text,
        to: item.to
      };
  
      if (item.description && item.description.length) {
        navItem.description = item.description;
      }
  
      if (item.children && item.children.length) {
        navItem.children = processDrupalNavData(item.children);
      }
  
      return navItem;
    });
  }

  /*
    Create navigation nodes.
  */
  function createNavNode(id, type, data) {
    const processedData = processDrupalNavData(data)

    const nodeMeta = {
      id,
      parent: null,
      children: [],
      internal: {
        type: type,
        content: JSON.stringify(data),
        contentDigest: createContentDigest(processedData)
      },
      nav: processedData
    }
    createNode(nodeMeta)
  }
  
  const baseUrlWithoutTrailingSlash = removeTrailingSlash(baseUrl)

  /*
    Fetch data from Drupal for primary and utlity,
    process it, then create nodes for each.
  */
  const nav_primary_data =
    await fetch(baseUrlWithoutTrailingSlash + '/api/nav/primary')
    .then(response => response.json())

  createNavNode('nav-primary', 'NavPrimary', nav_primary_data[0].children)

  const nav_utility_data =
    await fetch(baseUrlWithoutTrailingSlash + '/api/nav/utility')
    .then(response => response.json())

  createNavNode('nav-utlity', 'NavUtility', nav_utility_data[0].children)

  // Tell Gatsby we're done.
  return
}

const drupal_node_types_we_care_about = [
  'page', 'landing_page', 'room', 'building'
]

// Create a slug for each page and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }, { baseUrl }) => {
  const { createNodeField } = actions

  // Check for Drupal node type.
  // Substring off the "node__" part.
  if (drupal_node_types_we_care_about.includes(node.internal.type.substring(6))) {

    // Create slug field to be used in the URL
    createNodeField({
      node,
      name: `slug`,
      value: node.path.alias,
    })
  }

  // Breadcumb
  // If the page has a breadcrumb, fetch it and store it as 'breadcrumb' field.
  function processBreadcrumbData(data) {

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
      createNodeField({
        node,
        name: `breadcrumb`,
        value: result
      })
    }
  }

  /*
    If the node has a field_breadcrumb then that means
    we should check if it has breadcrumb data for us to
    process.
  */
  if (node.field_breadcrumb) {
    fetch(baseUrl + node.field_breadcrumb, {
      retries: 5,
      retryDelay: 2500
    })
      .catch(err => console.error(err))
      .then(response => response.json())
      .then(data => processBreadcrumbData(data))
  }

  /*
    Check if the node has field_parent_menu. This will be
    a list of Drupal entitity IDs to use for look up.

    This is useful for side navigation.
  */
  if (node.field_parent_menu) {
    fetch(baseUrl + node.field_parent_menu, {
      retries: 5,
      retryDelay: 2500
    })
      .catch(err => console.error(err))
      .then(response => response.json())
      .then(data => {
        const sanitizedData = sanitizeDrupalView(data)

        /*
          Take the uuid off each item and make an array of those.
          Or send an empty array.
        */
        const value = sanitizedData ? sanitizedData.map(({ uuid }) => uuid) : []

        createNodeField({
          node,
          name: "parents",
          value
        })
      })
  }
}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }, { baseUrl }) => {
  const { createPage } = actions
  // Create landing pages
  return new Promise((resolve, reject) => {
    const landingPageTemplate = path.resolve(`src/templates/landing-page.js`);
    const pageTemplate = path.resolve(`src/templates/page.js`);

    // Query for page nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            allNodeLandingPage {
              edges {
                node {
                  fields {
                    slug
                  }
                }
              }
            }
            allNodePage {
              edges {
                node {
                  fields {
                    slug
                    parents
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        // Create pages.
        result.data.allNodePage.edges.forEach(({ node }) => {
          createPage({
            path: node.fields.slug,
            component: pageTemplate,
            context: {
              slug: node.fields.slug,
              parents: node.fields.parents
            }
          })
        })
        
        // Create landing pages.
        result.data.allNodeLandingPage.edges.forEach(({ node }) => {
          createPage({
            path: node.fields.slug,
            component: landingPageTemplate,
            context: {
              slug: node.fields.slug
            }
          })
        })
      })
    )
  })
}