import { graphql } from 'gatsby'

export const query = graphql`
  fragment buildingCardFragment on node__building {
    __typename
    title
    field_horizontal_nav_title
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
    body {
      summary
    }
    fields {
      slug
      breadcrumb
    }
    field_building_address {
      locality
      address_line1
      postal_code
      administrative_area
    }
    field_access {
      processed
    }
    relationships {
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(
                  srcSetBreakpoints: [320, 640, 960]
                  maxWidth: 960
                ) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
      field_hours_open {
        ...hoursFragment
      }
    }
  }
`
