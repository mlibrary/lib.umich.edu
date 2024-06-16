import createGoogleMapsURL from './utilities/create-google-maps-url';
import Link from './link';
import PropTypes from 'prop-types';
import React from 'react';

const getName = ({ node }) => {
  const { field_room_building: fieldRoomBuilding, field_parent_location: fieldParentLocation } = node.relationships;

  if (fieldRoomBuilding) {
    return fieldRoomBuilding.title;
  }

  if (fieldParentLocation) {
    return fieldParentLocation.title;
  }

  return null;
};

const getFloor = ({ node }) => {
  const { field_floor: fieldFloor } = node.relationships;

  if (fieldFloor) {
    const fieldSplit = fieldFloor.name.split(' - ');
    const floor = fieldSplit[fieldSplit.length - 1];

    return floor;
  }

  return null;
};

/*
 *Get things like location name, floor, and room number.
 *
 *Returns
 *```
 *  [
 *    "Eighth Floor, Room 807",
 *    "Hatcher Library South"
 *  ]
 *```
 */
const getDescription = ({ node }) => {
  const { field_room_number: fieldRoomNumber } = node;
  const name = getName({ node });
  const floor = getFloor({ node });
  const room = fieldRoomNumber ? `Room ${fieldRoomNumber}` : null;

  // Remove null values
  const line1 = [floor, room].filter((item) => {
    return item !== null;
  });
  const line2 = [name].filter((item) => {
    return item !== null;
  });

  if (line1.length > 0 || line2.lenght > 0) {
    return [line1.join(', '), line2];
  }

  return null;
};

/*
 *Take raw Drupal address data and build and
 *array of the strings we can about.
 *
 *Example returns
 *
 *```
 *  [
 *    "913 S. University Ave",
 *    "Ann Arbor, MI 48109-1190"
 *  ]
 *```
 *
 *or
 *
 *```
 *  [
 *    "2800 Plymouth Road",
 *    "Building 18, Room G018",
 *    "Ann Arbor, MI 48109"
 *  ]
 *```
 */
const transformAddressDataToArray = ({ data, kind }) => {
  const {
    organization,
    address_line1: addressLine1,
    address_line2: addressLine2,
    locality,
    administrative_area: administrativeArea,
    postal_code: postalCode
  } = data;

  /*
   * This is a special one...
   * eg MLibrary@NCRC describes building and room with line2.
   */
  const line2 = kind === 'brief' ? null : addressLine2;

  return [
    organization,
    addressLine1,
    line2,
    `${locality}, ${administrativeArea} ${postalCode}`
  ].filter((line) => {
    return typeof line === 'string' && line.length > 0;
  });
};

/*
 *Given a Node, determine how to return related address data.
 *
 *Successful response example:
 *```
 *  [
 *    "2281 Bonisteel Blvd",
 *    "Ann Arbor, MI 48109-2094"
 *  ]
 *```
 *
 *otherwise `null`
 */
const getAddress = ({ node, kind }) => {
  const { field_building_address: fieldBuildingAddress } = node;
  const { field_parent_location: fieldParentLocation, field_room_building: fieldRoomBuilding } = node.relationships;

  /*
   * Use building if it has data that is more than an empty string.
   * Drupal sends empty strings for "null" data somtimes...
   * eg AAEL or Hatcher Library
   */
  if (fieldBuildingAddress && fieldBuildingAddress.address_line1.length) {
    return transformAddressDataToArray({ data: fieldBuildingAddress, kind });
  }

  /*
   * If no building data, then lookup room building.
   * eg Papyrology Collection
   */
  if (
    fieldRoomBuilding
    && fieldRoomBuilding.field_building_address.address_line1.length
  ) {
    const result = transformAddressDataToArray({
      data: fieldRoomBuilding.field_building_address,
      kind
    });

    return result;
  }

  /*
   * If neither building or room_building have data,
   * use parent_location field.
   * eg Asia Library
   */
  if (fieldParentLocation) {
    return transformAddressDataToArray({
      data: fieldParentLocation.field_building_address,
      kind
    });
  }

  return null;
};

/*
 *Render address lines, eg
 *
 *```
 *913 S. University Ave
 *Ann Arbor, MI 48109-1190
 *```
 *
 *But optionally include a directions link (Google Maps)
 *and prepend with location name and floor information.
 *
 *```
 *Eighth Floor
 *913 S. University Ave
 *Ann Arbor, MI 48109-1190
 *[View directions]
 *```
 *
 *addressData is an override to avoid the address data look up on
 *the node. eg, non-library location for news.
 */
export default function Address ({
  node,
  addressData,
  directions = false,
  kind = 'brief',
  ...rest
}) {
  const description = kind === 'full' ? getDescription({ node }) : [];

  // eslint-disable-next-line init-declarations
  let address, lines;

  if (addressData) {
    lines = transformAddressDataToArray({
      data: addressData,
      kind
    });
    address = lines;
  } else {
    address = getAddress({ kind, node });
    lines = description ? description.concat(address) : address;
  }

  return (
    <address {...rest}>
      {lines.map((line, item) => {
        return (
          <p key={line + item}>{line}</p>
        );
      })}

      {directions && (
        <Link
          to={createGoogleMapsURL({
            placeId: null,
            query: address.join(' ')
          })}
        >
          View directions
        </Link>
      )}
    </address>
  );
}

Address.propTypes = {
  addressData: PropTypes.object,
  directions: PropTypes.bool,
  kind: PropTypes.string,
  node: PropTypes.object
};
