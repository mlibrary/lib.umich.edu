export default function getParentTitle ({ node }) {
  const { field_parent_location: fieldParentLocation, field_room_building: fieldRoomBuilding } = node.relationships;

  if (fieldParentLocation) {
    return fieldParentLocation.title;
  } else if (fieldRoomBuilding) {
    return fieldRoomBuilding.title;
  }

  return null;
}
