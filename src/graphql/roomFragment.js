import { graphql } from 'gatsby'

export const query = graphql`
  fragment roomFragment on node__room {
    title
    field_horizontal_nav_title
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
    field_hours_different_from_build
    field_local_navigation
    body {
      summary
    }
    fields {
      slug
      breadcrumb
    }
    field_access {
      processed
    }
    relationships {
      field_room_building {
        relationships {
          field_hours_open {
            ...hoursFragment
          }
        }
      }
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(
                  srcSetBreakpoints: [320, 640, 960, 1280]
                  maxWidth: 960
                  quality: 90
                ) {
                  ...GatsbyImageSharpFluid_withWebp_noBase64
                }
              }
            }
          }
        }
      }
      field_room_building {
        field_building_address {
          locality
          address_line1
          postal_code
          administrative_area
        }
      }
      field_hours_open {
        ...hoursFragment
      }
      field_parent_page {
        ... on node__section_page {
          ...sectionCardFragment
        }
      }
      field_parking {
        description {
          processed
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
    }
  }
`
