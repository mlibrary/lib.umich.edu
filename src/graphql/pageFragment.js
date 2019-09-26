import { graphql } from 'gatsby'

export const query = graphql`
  fragment pageFragment on node__page {
    title
    field_local_navigation
    drupal_id
    drupal_internal__nid
    fields {
      breadcrumb
    }
    body {
      processed
    }
    relationships {
      field_parent_page {
        ... on node__page {
          title
          fields {
            slug
          }
        }
      }
      field_panels {
        ... on paragraph__card_panel {
          ...CardPanelFragment
        }
        ... on paragraph__text_panel {
          field_title
          id
          relationships {
            field_text_template {
              field_machine_name
            }
            field_text_card {
              field_title
              field_body {
                processed
              }
            }
          }
        }
      }
    }
  }
`
