/*
  Given a Node, determine how to return related address data.

  Successful response example:
  ```
    [
      "2281 Bonisteel Blvd",
      "Ann Arbor, MI 48109-2094"
    ]
  ```

  otherwise `null`
*/
export default function getAddress({ node }) {
  console.log('getAddress', node)
  const { field_building_address } = node
  const { field_parent_location, field_room_building } = node.relationships

  // Use building if it has data that is more than an empty string.
  // Drupal sends empty strings for "null" data somtimes...
  // eg AAEL or Hatcher Library
  if (field_building_address && field_building_address.address_line1.length) {
    return transformAddressDataToArray({ data: field_building_address })
  }

  // If no building data, then lookup room building.
  // eg Papyrology Collection
  if (
    field_room_building &&
    field_room_building.field_building_address.address_line1.length
  ) {
    return transformAddressDataToArray({
      data: field_room_building.field_building_address,
    })
  }

  // If neither building or room_building have data,
  // use parent_location field.
  // eg Asia Library
  if (field_parent_location) {
    return transformAddressDataToArray({
      data: field_parent_location.field_building_address,
    })
  }

  return null
}

function transformAddressDataToArray({ data }) {
  const { address_line1, locality, administrative_area, postal_code } = data

  return [address_line1, `${locality}, ${administrative_area} ${postal_code}`]
}
