import { graphql, useStaticQuery } from 'gatsby';

export default function useFloorPlan (bid, fid) {
  const data = useStaticQuery(
    graphql`
      query {
        allNodeFloorPlan {
          edges {
            node {
              ...floorPlanFragment
            }
          }
        }
      }
    `
  );

  if (!bid && !fid) {
    return null;
  }

  // eslint-disable-next-line no-shadow
  const { node } = data.allNodeFloorPlan.edges.find(({ node }) => {
    const { field_room_building: fieldRoomBuilding, field_floor: fieldFloor } = node.relationships;

    // The floor plan node matches when building and floor id both match.
    return fieldRoomBuilding.id === bid && fieldFloor.id === fid;
  });

  return node;
}
