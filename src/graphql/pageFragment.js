import { graphql } from 'gatsby'

export const query = graphql`
  fragment pageFragment on node__page {
    __typename
    title
    field_local_navigation
    drupal_id
    drupal_internal__nid
    field_seo_title
    field_seo_keywords
    fields {
      breadcrumb
      slug
    }
    body {
      processed
      summary
    }
    relationships {
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 640) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
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
              field_link {
                uri
              }
              field_body {
                processed
              }
            }
          }
        }
        ...heroPanelFragment
        ...groupPanelFragment
      }
    }
  }
`
