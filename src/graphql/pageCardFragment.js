import { graphql } from 'gatsby'

export const query = graphql`
  fragment pageCardFragment on node__page {
    title
    field_local_navigation
    drupal_id
    body {
      summary
    }
    fields {
      slug
    }
  }
`
