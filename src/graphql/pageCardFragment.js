import { graphql } from 'gatsby';

export const query = graphql`
  fragment pageCardFragment on node__page {
    __typename
    title
    field_title_context
    field_local_navigation
    drupal_id
    body {
      summary
    }
    fields {
      slug
    }
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
    }
  }
`;
