import { graphql } from 'gatsby'

export const query = graphql`
  fragment pageFragment on node__page {
    __typename
    title
    field_title_context
    field_local_navigation
    drupal_id
    drupal_internal__nid
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
        field_image_caption {
          processed
        }
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 920) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
      field_collecting_area {
        relationships {
          user__user {
            ...userFragment
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
        __typename
        ...cardPanelFragment
        ...textPanelFragment
        ...linkPanelFragment
        ...heroPanelFragment
        ...groupPanelFragment
      }
    }
  }
`
