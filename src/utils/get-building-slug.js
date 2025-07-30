/*
    Extracts a building slug from a node's relationship structure.
    Uses a cascading fallback pattern to find the most appropriate slug.
 */
export default function getBuildingSlug ({ node }) {
  if (!node?.relationships) {
    return null;
  }

  const { relationships } = node;
  const buildingNode = relationships?.field_room_building;
  const parentLocationNode = relationships?.field_parent_location;

  const slugCandidates = [
    parentLocationNode?.relationships?.field_parent_location?.fields?.slug,
    buildingNode?.relationships?.field_parent_location?.fields?.slug,
    parentLocationNode?.fields?.slug,
    buildingNode?.fields?.slug
  ];

  return slugCandidates.find(Boolean) || null;
}
