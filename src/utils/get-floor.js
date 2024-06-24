export default function getFloor ({ node }) {
  const { field_floor } = node.relationships;

  if (field_floor) {
    const floor_split = field_floor.name.split(' - ');
    const floor = floor_split[floor_split.length - 1];

    return floor;
  }

  return null;
}
