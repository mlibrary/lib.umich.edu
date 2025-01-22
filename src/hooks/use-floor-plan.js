import { graphql, useStaticQuery } from 'gatsby';

export default function useFloorPlan (bid, fid, nids) {
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

  if (!bid && !fid && (!nids || nids.length === 0)) {
    return null;
  }

  const plans = data.allNodeFloorPlan.edges.map(({ node }) => {
    return node;
  });

  // Match floor plans by buildingId and floorId
  if (bid && fid) {
    return plans.find(
      (node) => {
        return node.relationships.field_room_building.id === bid
          && node.relationships.field_floor.id === fid;
      }
    );
  }

  // Match floor plans by an array of drupal_internal__nid
  if (nids && nids.length > 0) {
    return plans.filter((node) => {
      return nids.includes(node.drupal_internal__nid);
    });
  }

  return null;
}
