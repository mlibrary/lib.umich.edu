/*
  Objective: Provide a complete site map of the pages from Drupal.
  
  Why: To be able to build out site navigation, such as
       breadcrumbs, dropdown navigation, and sub page trees.

  Tasks:
    1. Do necessary plugin setup to create site map node
    2. Fetch data from Drupal and build the data structure.
    3. Create the Gatsby node.

  Remember a few concepts:
  - Node — a data object
  - Node Field — a field added by a plugin to a node that
    it doesn’t control
  - Node Link — a connection between nodes that gets converted
    to GraphQL relationships. Can be created in a variety of ways
    as well as automatically inferred. Parent/child links from
    nodes and their transformed derivative nodes are first class links.

  https://www.gatsbyjs.org/docs/api-specification/

  Two options. Eliot built an endpoint on Drupal to request page ordering.

  1. 
  - https://dev.lib.umich.edu/web/parent-menu-order-json/149/1
  - https://dev.lib.umich.edu/web/parent-menu-order-json/149/0
  - https://dev.lib.umich.edu/web/child-menu-order-json/112?_format=schema_json

  2. Or, use the menu system.
  // https://dev.lib.umich.edu/web/jsonapi/menu/menu
*/

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions
  // Create nodes here, generally by downloading data
  // from a remote API.
  const data = await fetch(REMOTE_API)

  // Process data into nodes.
  data.forEach(datum => createNode(processDatum(datum)))

  // We're done, return.
  return
}