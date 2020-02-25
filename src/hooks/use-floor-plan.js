import { useStaticQuery, graphql } from 'gatsby'

export default function useFloorPlan(bid, fid) {
  const data = useStaticQuery(
    graphql`
      query {
        allNodeFloorPlan {
          edges {
            node {
              title
              field_seo_title
              relationships {
                field_room_building {
                  id
                }
                field_floor {
                  id
                }
              }
            }
          }
        }
      }
    `
  )

  return data.allNodeFloorPlan.edges.find(({ node }) => {
    const { field_room_building, field_floor } = node.relationships

    // The floor plan node matches when building and floor id both match.
    return field_room_building.id === bid && field_floor === fid
  })
}
