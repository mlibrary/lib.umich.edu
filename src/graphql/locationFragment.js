import { graphql } from 'gatsby'

export const query = graphql`
  fragment locationFragment on node__location {
    title
    field_horizontal_nav_title
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
    field_address_is_different_from_
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
    field_address_is_different_from_
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
      field_parent_location {
        field_building_address {
          locality
          address_line1
          postal_code
          administrative_area
        }
      }
      field_parent_page {
        ... on node__section_page {
          ...sectionCardFragment
        }
      }
      field_visit {
        description {
          processed
        }
      }
      field_amenities {
        name
      }
      field_hours_open {
        ...hoursFragment
      }
    }
  }
`
