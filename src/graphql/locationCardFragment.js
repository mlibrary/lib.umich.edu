import { graphql } from 'gatsby'

export const query = graphql`
  fragment locationCardFragment on node__location {
    title
    field_building_address {
      locality
      address_line1
      postal_code
      administrative_area
    }
  }
`
