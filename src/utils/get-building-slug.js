/*
    Extracts a building slug from a node's relationship structure.
    Uses a cascading fallback pattern to find the most appropriate slug.
 */
export default function getBuildingSlug ({ node }) {
  console.log('getBuildingSlug called with node:', node);
  if (!node?.relationships) {
    return null;
  }

  const { relationships } = node;
  const buildingNode = relationships?.field_room_building;
  const parentLocationNode = relationships?.field_parent_location;

  // Try to get slug from parent location's parent location first
  const parentLocationParentSlug = parentLocationNode?.relationships?.field_parent_location?.fields?.slug;
  if (parentLocationParentSlug) {
    return parentLocationParentSlug;
  }

  // Try to get slug from building node's parent location
  const buildingParentSlug = buildingNode?.relationships?.field_parent_location?.fields?.slug;
  if (buildingParentSlug) {
    return buildingParentSlug;
  }

  // Try to get slug directly from parent location node
  const parentLocationSlug = parentLocationNode?.fields?.slug;
  if (parentLocationSlug) {
    return parentLocationSlug;
  }

  // Finally, try to get slug directly from building node
  const buildingSlug = buildingNode?.fields?.slug;
  if (buildingSlug) {
    return buildingSlug;
  }

  return null;
}
