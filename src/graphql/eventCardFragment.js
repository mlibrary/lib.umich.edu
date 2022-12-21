import { graphql } from 'gatsby';

export const query = graphql`
  fragment eventCardFragment on node__events_and_exhibits {
    __typename
    id
    title
    field_title_context
    fields {
      slug
    }
    body {
      summary
    }
    field_event_date_s_ {
      value
      end_value
    }
    field_event_online
    field_event_in_non_library_locat
    field_non_library_location_addre {
      organization
    }
    relationships {
      field_event_type {
        name
      }
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                gatsbyImageData(
                  width: 320
                  placeholder: NONE
                  layout: CONSTRAINED
                )
              }
            }
          }
        }
      }
      field_event_room {
        ... on Node {
          __typename
          ...locationFragment
          ...roomFragment
        }
      }
      field_event_building {
        ...buildingFragment
      }
    }
  }
`;
