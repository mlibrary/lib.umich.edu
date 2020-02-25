import { graphql } from 'gatsby'

export const query = graphql`
  fragment floorPlanFragment on node__floor_plan {
    __typename
    drupal_internal__nid
    title
    field_title_context
    body {
      processed
    }
    fields {
      slug
      breadcrumb
    }
    field_local_navigation
    relationships {
      field_room_building {
        ...buildingCardFragment
      }
      field_floor {
        id
        name
      }
      field_design_template {
        field_machine_name
      }
      field_svg_image {
        localFile {
          publicURL
        }
      }
      field_printable_image {
        localFile {
          publicURL
        }
      }
    }
  }
`
