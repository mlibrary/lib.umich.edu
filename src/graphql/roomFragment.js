import { graphql } from 'gatsby';

export const query = graphql`
  fragment roomFragment on node__room {
    __typename
    title
    field_title_context
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_noise_level
    field_space_features
    field_email
    field_hours_different_from_build
    field_local_navigation
    field_is_location_
    field_display_hours_
    body {
      summary
      processed
    }
    fields {
      slug
      breadcrumb
    }
    field_access {
      processed
    }
    field_room_number
    field_phone_number
    field_booking_email
    field_url {
      uri
    }
    relationships {
      field_floor_plan {
        fields {
          slug
          title
        }
      }
      field_room_building {
        id
        title
        field_building_address {
          locality
          address_line1
          postal_code
          administrative_area
        }
        field_display_hours_
        relationships {
          field_hours_open {
            ...hoursFragment
          }
          field_parent_location {
            title
            field_display_hours_
            relationships {
              field_hours_open {
                ...hoursFragment
              }
            }
          }
        }
      }
      field_floor {
        id
        name
      }
      field_media_image {
        field_media_image {
          alt
        }
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                gatsbyImageData(
                  width: 920
                  placeholder: NONE
                  layout: CONSTRAINED
                )
              }
            }
          }
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
      field_visit {
        weight
        description {
          processed
        }
      }
      field_amenities {
        weight
        name
        description {
          processed
        }
      }
      field_panels {
        ...linkPanelFragment
        ...cardPanelFragment
        ...textPanelFragment
      }
    }
  }
`;
