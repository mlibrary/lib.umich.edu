import React from 'react'

import Link from './link'
import createGoogleMapsURL from './utilities/create-google-maps-url'

/*
  Render address lines, eg

  ```
  913 S. University Ave
  Ann Arbor, MI 48109-1190
  ```

  But optionally include a directions link (Google Maps)
  and prepend with location name and floor information.

  ```
  Eighth Floor
  913 S. University Ave
  Ann Arbor, MI 48109-1190
  [View directions]
  ```
*/
export default function Address({
  node,
  directions = false,
  kind = 'brief',
  ...rest
}) {
  const description = kind === 'full' ? getDescription({ node }) : []
  const address = getAddress({ node, kind })
  const lines = description ? description.concat(address) : address

  return (
    <address {...rest}>
      {lines.map((line, i) => (
        <p key={node.id + line + i}>{line}</p>
      ))}

      {directions && (
        <Link
          to={createGoogleMapsURL({
            query: address.join(' '),
            place_id: null,
          })}
        >
          View directions
        </Link>
      )}
    </address>
  )
}

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
function getAddress({ node }) {
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
    let result = transformAddressDataToArray({
      data: field_room_building.field_building_address,
    })

    return result
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

/*
  Get things like location name, floor, and room number.

  Returns
  ```
    [
      "Eighth Floor, Room 807",
      "Hatcher Library South"
    ]
  ```
*/
function getDescription({ node }) {
  const { field_room_number } = node
  const name = getName({ node })
  const floor = getFloor({ node })
  const room = field_room_number ? 'Room ' + field_room_number : null

  // Remove null values
  const line1 = [floor, room].filter(item => item !== null)
  const line2 = [name].filter(item => item !== null)

  if (line1.length > 0 || line2.lenght > 0) {
    return [line1.join(', '), line2]
  }

  return null
}

function getName({ node }) {
  const { field_room_building, field_parent_location } = node.relationships

  if (field_room_building) {
    return field_room_building.title
  }

  if (field_parent_location) {
    return field_parent_location.title
  }

  return null
}

function getFloor({ node }) {
  const { field_floor } = node.relationships

  if (field_floor) {
    const floor_split = field_floor.name.split(' - ')
    const floor = floor_split[floor_split.length - 1]

    return floor
  }

  return null
}
