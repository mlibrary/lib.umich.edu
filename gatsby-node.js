const path = require(`path`)
const dns = require('dns');
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// Create a slug for each page and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  /*
  console.log('dns.getServers()', dns.getServers())
  dns.lookup(
    'dev.lib.umich.edu',
    {all: true},
    (err, address, family) => console.log('address: %j family: IPv%s', address, family)
  );
  */

  // Check for Drupal node type and assign alias as the slug.
  if (
    node.internal.type === `node__page` ||
    node.internal.type === `node__landing_page` ||
    node.internal.type === `node__room`
  ) {
    createNodeField({
      node,
      name: `slug`,
      value: node.path.alias,
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