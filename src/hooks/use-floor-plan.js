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

  const match = data.allNodeFloorPlan.edges.find(({ node }) => {
    const { field_room_building: fieldRoomBuilding, field_floor: fieldFloor }
      = node.relationships;
    return fieldRoomBuilding?.id === bid && fieldFloor?.id === fid;
  });

  return match?.node || null;
}
