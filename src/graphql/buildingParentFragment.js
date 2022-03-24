import { graphql } from 'gatsby';

export const query = graphql`
  fragment buildingParentFragment on node__building {
    __typename
    id
    title
    field_title_context
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
      field_hours_open {
        ...hoursFragment
      }
      field_parent_page {
        ...sectionCardFragment
      }
      field_visit {
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
      field_parent_location {
        __typename
        ... on node__location {
          ...locationParentFragment
        }
      }
    }
  }
`;
