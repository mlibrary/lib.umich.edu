import { graphql } from 'gatsby'

export const query = graphql`
  fragment eventFragment on node__events_and_exhibits {
    __typename
    title
    field_title_context
    fields {
      slug
      breadcrumb
    }
    body {
      summary
      processed
    }
    field_event_date_s_ {
      value
      end_value
    }
    field_registration_link {
      uri
    }
    field_registration_required
    relationships {
      field_event_type {
        name
      }
      field_event_series {
        name
      }
      field_media_image {
        field_image_caption {
          processed
        }
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 320) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
    }
  }
`
