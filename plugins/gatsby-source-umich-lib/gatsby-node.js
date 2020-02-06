const path = require(`path`)
const { fetch } = require('./fetch')
const { createBreadcrumb } = require(`./create-breadcrumb`)
const { createStaffNodes } = require(`./create-staff-nodes`)
const https = require('https')
const fs = require('fs')
const readline = require('readline')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

function removeTrailingSlash(s) {
  return s.replace(/\/$/, '')
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
exports.sourceNodes = async ({ actions, createContentDigest }, { baseUrl }) => {
  const { createTypes, createNode } = actions
  const typeDefs = `
    type HTML {
      processed: String
    }

    type paragraph__hero_panel implements Node {
      field_caption_text: HTML
    }
  `

  createTypes(typeDefs)

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
        to: item.to,
      }

      if (item.description && item.description.length) {
        navItem.description = item.description
      }

      if (item.children && item.children.length) {
        navItem.children = processDrupalNavData(item.children)
      }

      if (item.field_icon) {
        navItem.icon = item.field_icon
      }

      return navItem
    })
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
        contentDigest: createContentDigest(processedData),
      },
      nav: processedData,
    }
    createNode(nodeMeta)
  }

  const baseUrlWithoutTrailingSlash = removeTrailingSlash(baseUrl)

  /*
    Fetch data from Drupal for primary and utlity,
    process it, then create nodes for each.
  */
  const nav_primary_data = await fetch(
    baseUrlWithoutTrailingSlash + '/api/nav/primary'
  )
  createNavNode('nav-primary', 'NavPrimary', nav_primary_data[0].children)

  const nav_utility_data = await fetch(
    baseUrlWithoutTrailingSlash + '/api/nav/utility'
  )
  createNavNode('nav-utlity', 'NavUtility', nav_utility_data[0].children)

  /*
    Fetch Staff person related data. Used for creating
    Staff Directory and Specialist pages.
  */
  const staffRawData = await fetch(baseUrlWithoutTrailingSlash + '/api/staff')
  createStaffNodes({ createNode, staffRawData })

  // Tell Gatsby we're done.
  return
}

const drupal_node_types_we_care_about = [
  'page',
  'building',
  'section_page',
  'location',
  'room',
]

async function createParentChildFields(
  node,
  createNodeField,
  fieldId,
  name,
  baseUrlWithoutTrailingSlash
) {
  if (node[fieldId]) {
    const url = baseUrlWithoutTrailingSlash + node[fieldId]
    const data = await fetch(url)
    const sanitizedData = sanitizeDrupalView(data)
    const value = sanitizedData
      ? sanitizedData.map(({ uuid }) => uuid)
      : [`no-${name}`]

    createNodeField({
      node,
      name,
      value,
    })
  }

  return
}

// Create a slug for each page and set it as a field on the node.
exports.onCreateNode = async ({ node, actions }, { baseUrl }) => {
  // Check for Drupal node type.
  // Substring off the "node__" part.
  // Also make sure it has a design template.

  if (
    drupal_node_types_we_care_about.includes(node.internal.type.substring(6)) &&
    node.relationships.field_design_template
  ) {
    const { createNodeField } = actions
    const baseUrlWithoutTrailingSlash = removeTrailingSlash(baseUrl)

    // Handle creating breadcrumb for node.
    createBreadcrumb({
      node,
      createNodeField,
      baseUrl: baseUrlWithoutTrailingSlash,
    })

    createNodeField({
      node,
      name: `slug`,
      value: node.path.alias,
    })

    createNodeField({
      node,
      name: `title`,
      value: node.title,
    })

    await createParentChildFields(
      node,
      createNodeField,
      'field_parent_menu',
      'parents',
      baseUrlWithoutTrailingSlash
    )
    await createParentChildFields(
      node,
      createNodeField,
      'field_child_menu',
      'children',
      baseUrlWithoutTrailingSlash
    )
  }
}

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }, { baseUrl }) => {
  const readInterface = readline.createInterface({
    input: fs.createReadStream('public/_redirects'),
  })
  const { createRedirect } = actions
  readInterface.on('line', function(line) {
    if (line) {
      const urls = line.split(' ')
      /*
      console.log(
        'Creating client-side redirect from ' + urls[0] + ' to ' + urls[1]
      )
      */
      createRedirect({
        fromPath: urls[0],
        toPath: urls[1],
        isPermanent: true,
        redirectInBrowser: true,
        force: true,
      })
    }
  })

  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const basicTemplate = path.resolve(`src/templates/basic.js`)
    const fullWidthTemplate = path.resolve(`src/templates/fullwidth.js`)
    const landingTemplate = path.resolve(`src/templates/landing.js`)
    const sectionTemplate = path.resolve(`src/templates/section.js`)
    const visitTemplate = path.resolve(`src/templates/visit.js`)
    const homeTemplate = path.resolve(`src/templates/home.js`)
    const destinationBodyTemplate = path.resolve(
      `src/templates/destination-body.js`
    )
    const destinationFullTemplate = path.resolve(
      `src/templates/destination-full.js`
    )
    const staffDirectoryTemplate = path.resolve(
      `src/templates/staff-directory.js`
    )

    function getTemplate(node) {
      const { field_machine_name } = node.relationships.field_design_template

      switch (field_machine_name) {
        case 'basic':
          return basicTemplate
        case 'homepage':
          return homeTemplate
        case 'full_width':
          return fullWidthTemplate
        case 'landing_page':
          return landingTemplate
        case 'section':
        case 'section_locaside':
          return sectionTemplate
        case 'visit':
          return visitTemplate
        case 'destination_body':
          return destinationBodyTemplate
        case 'destination_full':
          return destinationFullTemplate
        case 'staff_directory':
          return staffDirectoryTemplate
        default:
          return null
      }
    }

    // Query for nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            pages: allNodePage(
              filter: {
                field_redirect_node: { eq: false }
                relationships: {
                  field_design_template: {
                    field_machine_name: {
                      in: [
                        "landing_page"
                        "basic"
                        "full_width"
                        "homepage"
                        "destination_body"
                        "destination_full"
                        "staff_directory"
                      ]
                    }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    parents
                    children
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  field_seo_keywords
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            sections: allNodeSectionPage(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: { in: ["section", "section_locaside"] }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    parents
                    children
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            buildings: allNodeBuilding(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: { in: ["visit"] }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    children
                    parents
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            rooms: allNodeRoom(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: {
                      in: [
                        "visit"
                        "basic"
                        "destination_body"
                        "destination_full"
                      ]
                    }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    children
                    parents
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            locations: allNodeLocation(
              filter: {
                relationships: {
                  field_design_template: {
                    field_machine_name: {
                      in: ["visit", "destination_body", "destination_full"]
                    }
                  }
                }
              }
            ) {
              edges {
                node {
                  title
                  fields {
                    slug
                    title
                    children
                    parents
                  }
                  drupal_internal__nid
                  body {
                    summary
                  }
                  relationships {
                    field_design_template {
                      field_machine_name
                    }
                  }
                }
              }
            }
            profiles: allUserUser(
              filter: { field_make_profile_public: { eq: true } }
            ) {
              edges {
                node {
                  __typename
                  field_make_profile_public
                  field_user_display_name
                  field_user_work_title
                  name
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        /*
          Make CMS pages that have configurable templates.
        */
        const { pages, sections, buildings, rooms, locations } = result.data
        const edges = pages.edges
          .concat(sections.edges)
          .concat(buildings.edges)
          .concat(rooms.edges)
          .concat(locations.edges)

        edges.forEach(({ node }) => {
          const template = getTemplate(node)
          const summary = node.body ? node.body.summary : null
          const keywords = node.field_seo_keywords
            ? node.field_seo_keywords
            : ''

          if (template) {
            createPage({
              path: node.fields.slug,
              component: template,
              context: {
                ...node.fields,
                title: node.title,
                drupal_nid: node.drupal_internal__nid,
                summary,
                keywords: keywords,
              },
            })
          }
        })

        /*
          Make non CMS template pages
        */
        const { profiles } = result.data

        profiles.edges.forEach(({ node }) => {
          const profileTemplate = path.resolve(`src/templates/profile.js`)

          createPage({
            path: `/users/${node.name}`,
            component: profileTemplate,
            context: {
              name: node.name,
              title: node.field_user_display_name,
              summary: node.field_user_work_title, // used for site search
              isProfile: true,
            },
          })
        })
      })
    )
  })
}

exports.onPreBootstrap = async ({}, { baseUrl }) => {
  const dir = 'public'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  const file = fs.createWriteStream('public/_redirects')
  const url = removeTrailingSlash(baseUrl)

  https.get(url + '/_redirects', function(response) {
    response.pipe(file)
    file.on('finish', function() {
      console.log('_redirects file downloaded')
    })
    file.on('error', function() {
      console.log('There was an error downloading _redirects file')
    })
  })

  return
}
