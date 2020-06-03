import { graphql } from 'gatsby'

export const query = graphql`
  fragment heroPanelFragment on paragraph__hero_panel {
    __typename
    id
    field_caption_text {
      processed
    }
    field_background
    field_placement
    field_title
    relationships {
      field_hero_template {
        field_machine_name
      }
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
