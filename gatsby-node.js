const path = require(`path`)

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }, { baseUrl }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    // Query for nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            defaultPageNodes: allNodePage {
              edges {
                node {
                  fields {
                    slug
                  }
                }
              }
            }
            locationNodes: allNodeBuilding(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: { eq: "location" }
                  }
                }
              }
            ) {
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

        const {
          locationNodes,
          defaultPageNodes
        } = result.data

        function handleCreatePages(edges, template) {
          edges.forEach(({ node }) => {
            createPage({
              path: node.fields.slug,
              component: template,
              context: {
                slug: node.fields.slug
              }
            })
          })
        }

        handleCreatePages(
          defaultPageNodes.edges,
          path.resolve(`./src/templates/default.js`)
        )
        handleCreatePages(
          locationNodes.edges,
          path.resolve(`./src/templates/location.js`)
        )
      })
    )
  })
}