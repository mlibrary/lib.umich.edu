import { graphql } from 'gatsby';

export const query = graphql`
  fragment sectionCardFragment on node__section_page {
    __typename
    title
    field_title_context
    drupal_internal__nid
    drupal_id
    fields {
      slug
    }
    body {
      summary
    }
    relationships {
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
    }
  }
`;
