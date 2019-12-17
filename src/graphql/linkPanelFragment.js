import { graphql } from 'gatsby'

export const query = graphql`
  fragment linkPanelFragment on paragraph__link_panel {
    __typename
    id
    field_title
    field_link {
      uri
      title
    }
    relationships {
      field_link_template {
        field_machine_name
      }
    }
  }
`
