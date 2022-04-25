import { graphql } from 'gatsby';

export const query = graphql`
  fragment textPanelFragment on paragraph__text_panel {
    __typename
    field_title
    id
    field_placement
    field_border
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
        relationships {
          field_text_image {
            relationships {
              field_media_image {
                localFile {
                  childImageSharp {
                    gatsbyImageData(
                      width: 620
                      placeholder: NONE
                      layout: CONSTRAINED
                    )
                  }
                }
                relationships {
                  media__image {
                    field_media_image {
                      alt
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
