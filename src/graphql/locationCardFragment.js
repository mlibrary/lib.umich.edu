import { graphql } from 'gatsby'

export const query = graphql`
  fragment locationCardFragment on node__location {
    __typename
    title
    field_title_context
    field_url {
      uri
    }
    field_building_address {
      locality
      address_line1
      postal_code
      administrative_area
    }
  }
`
