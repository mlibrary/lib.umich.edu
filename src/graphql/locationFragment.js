import { graphql } from 'gatsby';

export const query = graphql`
  fragment locationFragment on node__location {
    __typename
    title
    field_title_context
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
    field_address_is_different_from_
    field_local_navigation
    body {
      summary
      processed
    }
    fields {
      slug
      breadcrumb
    }
    field_building_address {
      locality
      address_line1
      address_line2
      postal_code
      administrative_area
    }
    field_access {
      processed
    }
    field_url {
      uri
    }
    field_display_hours_
    field_hours_different_from_build
    relationships {
      field_media_image {
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
      field_panels {
        ...linkPanelFragment
        ...cardPanelFragment
        ...textPanelFragment
      }
      field_parent_location {
        __typename
        title
        ... on node__building {
          ...buildingCardFragment
        }
      }
      field_parent_page {
        __typename
        ... on node__section_page {
          ...sectionCardFragment
        }
        ... on node__location {
          title
        }
      }
      field_visit {
        weight
        description {
          processed
        }
      }
      field_amenities {
        name
        description {
          processed
        }
      }
      field_hours_open {
        ...hoursFragment
      }
      field_floor {
        name
        id
      }
    }
  }
`;
