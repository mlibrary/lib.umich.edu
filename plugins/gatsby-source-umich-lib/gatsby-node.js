const path = require(`path`)
const fetch = require("fetch-retry")
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const apiBase = 'https://dev.lib.umich.edu'

/*
  sourceNodes is only called once per plugin by Gatsby.
*/
exports.sourceNodes = async ({
  actions,
  createContentDigest
}) => {
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

  /*
    Fetch data from Drupal for primary and utlity,
    process it, then create nodes for each.
  */
  const nav_primary_data =
    await fetch(apiBase + '/api/nav/primary')
    .then(response => response.json())

  createNavNode('nav-primary', 'NavPrimary', nav_primary_data[0].children)

  const nav_utility_data =
    await fetch(apiBase + '/api/nav/utility')
    .then(response => response.json())

  createNavNode('nav-utlity', 'NavUtility', nav_utility_data[0].children)

  // Tell Gatsby we're done.
  return
}

// Create a slug for each page and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  // Check for Drupal node type.
  if (
    node.internal.type === `node__page` ||
    node.internal.type === `node__landing_page` ||
    node.internal.type === `node__room`
  ) {

    // Slug
    // Assign alias as the slug
    createNodeField({
      node,
      name: `slug`,
      value: node.path.alias,
    })

    // Breadcumb
    // If the page has a breadcrumb, fetch it and store it as 'breadcrumb' field.
    function processBreadcrumbData(data) {
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
      result = result.reverse()

      createNodeField({
        node,
        name: `breadcrumb`,
        value: result
      })
    }

    if (node.field_breadcrumb) {
      /*
        TOOD:
        - [ ] Write about why retry and delay.
      */
      fetch(apiBase + node.field_breadcrumb, {
        retries: 5,
        retryDelay: 2500
      })
        .catch(err => console.error(err))
        .then(response => response.json())
        .then(data => processBreadcrumbData(data))
    }
  }
}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  // Create landing pages
  return new Promise((resolve, reject) => {
    const landingPageTemplate = path.resolve(`src/templates/landing-page.js`);
    const pageTemplate = path.resolve(`src/templates/page.js`);
    const roomPageTemplate = path.resolve(`src/templates/room.js`);

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
                  }
                }
              }
            }
            allNodeRoom {
              edges {
                node {
                  title
                  fields {
                    slug
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
              slug: node.fields.slug
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

        // Create basic pages.
        result.data.allNodeRoom.edges.forEach(({ node }) => {
          createPage({
            path: node.fields.slug,
            component: roomPageTemplate,
            context: {
              slug: node.fields.slug
            }
          })
        })
      })
    )
  })
}