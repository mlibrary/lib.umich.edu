import { graphql } from 'gatsby'

export const query = graphql`
  fragment groupPanelFragment on paragraph__group_panel {
    __typename
    id
    field_panel_group_layout
    relationships {
      field_panel_group {
        __typename
        ...linkPanelFragment
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
