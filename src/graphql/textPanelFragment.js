import { graphql } from 'gatsby'

export const query = graphql`
  fragment textPanelFragment on paragraph__text_panel {
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
      }
    }
  }
`
