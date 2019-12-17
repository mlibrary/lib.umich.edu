import { graphql } from 'gatsby'

export const query = graphql`
  fragment CardPanelFragment on paragraph__card_panel {
    __typename
    field_title
    drupal_id
    id
    relationships {
      field_card_template {
        field_machine_name
      }
      field_cards {
        ...buildingCardFragment
        ...locationFragment
        ...roomFragment
        ...pageCardFragment
      }
    }
  }
`
