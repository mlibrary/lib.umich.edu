export default function getFloor ({ node }) {
  const { field_floor: fieldFloor } = node.relationships;

  if (fieldFloor) {
    const floorSplit = fieldFloor.name.split(' - ');
    const floor = floorSplit[floorSplit.length - 1];

    return floor;
  }

  return null;
}
