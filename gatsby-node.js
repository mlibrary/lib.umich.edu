const path = require(`path`)

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// Create a slug for each page and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  // Check for Drupal node type.
  if (
    node.internal.type === `pages` ||
    node.internal.type === `landing_pages`
  ) {
    createNodeField({
      node,
      name: `slug`,
      value: node.path.alias,
    })
  }
  if (node.body && node.body.format === `basic_html`) {
    createNodeField({
      node,
      name: `html`,
      value: node.body.processed,
    })
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

    // Query for page nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            allLandingPages {
              edges {
                node {
                  fields {
                    slug
                  }
                }
              }
            }
            allPages {
              edges {
                node {
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
        result.data.allPages.edges.forEach(({ node }) => {
          createPage({
            path: node.fields.slug,
            component: pageTemplate,
            context: {
              slug: node.fields.slug
            }
          })
        })

        
        // Create landing pages.
        result.data.allLandingPages.edges.forEach(({ node }) => {
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