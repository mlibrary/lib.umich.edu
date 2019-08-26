import React from 'react'

function Address({ data, ...rest }) {
  const {
    locality,
    address_line1,
    postal_code,
    administrative_area
  } = processAddressData(data)

  return (
    <address {...rest}>
      <p>{address_line1}</p>
      <p>{locality}, {administrative_area} {postal_code}</p>
    </address>
  )
}

export default Address

function processAddressData(data) {
  /*
    Each Drupal content type has it's own
    conditions for displaying address.
  */
  switch (data.__typename) {
    case 'node__room':
      return data.relationships.field_room_building.field_building_address
    case 'node__building':
      return data.field_building_address
    case 'node__location':
      if (data.field_address_is_different_from_ === true) {
        return data.field_building_address
      }
      if (data.relationships.field_parent_location) {
        return data.relationships.field_parent_location.field_building_address
      }
      break;
    default:
      return undefined
  }
}