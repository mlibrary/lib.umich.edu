import { graphql } from 'gatsby'

export const query = graphql`
  fragment customPanelFragment on paragraph__custom_panel {
    __typename
    id
    field_machine_name
  }
`
