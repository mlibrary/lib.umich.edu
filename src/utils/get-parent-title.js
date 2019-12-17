export default function getParentTitle({ node }) {
  const { field_parent_location, field_room_building } = node.relationships

  return field_parent_location
    ? field_parent_location.title
    : field_room_building
    ? field_room_building.title
    : null
}
