import { graphql } from 'gatsby'

export const query = graphql`
  fragment sectionCardFragment on node__section_page {
    title
    field_horizontal_nav_title
    drupal_internal__nid
    drupal_id
    fields {
      slug
    }
    body {
      summary
    }
  }
`
