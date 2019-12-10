import { graphql } from 'gatsby'

export const query = graphql`
  fragment groupPanelFragment on paragraph__group_panel {
    __typename
    id
    field_panel_group_layout
    relationships {
      field_panel_group {
        __typename
        ... on paragraph__link_panel {
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
        ... on paragraph__hours_panel_lite {
          id
          field_title
          relationships {
            field_cards {
              ... on Node {
                __typename
                ...locationFragment
                ...roomFragment
                ...buildingFragment
              }
            }
          }
        }
      }
    }
  }
`
