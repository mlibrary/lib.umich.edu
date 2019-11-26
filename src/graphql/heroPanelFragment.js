import { graphql } from 'gatsby'

export const query = graphql`
  fragment heroPanelFragment on paragraph__hero_panel {
    id
    field_caption_text {
      processed
    }
    relationships {
      field_hero_images {
        field_orientation
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 960) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
    }
  }
`
