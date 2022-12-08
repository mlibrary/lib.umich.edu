import React from 'react';

import { SPACING } from '../reusable';

import IconText from '../components/icon-text';
import icons from '../reusable/icons';
import Hours from '../components/todays-hours';
import Link from '../components/link';
import LocationAnchoredLink from '../components/location-anchored-link';

import useFloorPlan from '../hooks/use-floor-plan';

import { getFloor } from '../utils';

export default function DestinationLocationInfoContainer({ node }) {
  if (node.__typename === 'node__page') {
    return null;
  }

  return <DestinationLocationInfo node={node} />;
}

function resolveLocationFromNode(node) {
  const { relationships } = node;

  const buildingNode = relationships?.field_room_building;
  const parentLocationNode =
    relationships?.field_parent_location?.relationships?.field_parent_location;
  const locationNode = buildingNode
    ? buildingNode
    : parentLocationNode
    ? parentLocationNode
    : node;

  return locationNode;
}

function DestinationLocationInfo({ node }) {
  const { field_parent_location, field_room_building } = node.relationships;
  const bid = field_room_building
    ? field_room_building.id
    : field_parent_location?.id;
  const fid = node.relationships.field_floor?.id;
  const floorPlan = useFloorPlan(bid, fid);
  const shouldDisplayHours = node.field_display_hours_;
  const locationTitle = field_parent_location
    ? field_parent_location?.title
    : field_room_building?.title;
  const phone_number = node.field_phone_number;
  const email = node.field_email;
  const floor = getFloor({ node });
  const room = node.field_room_number && 'Room ' + node.field_room_number;
  const locationSummary = [locationTitle, floor, room]
    .filter((i) => typeof i === 'string')
    .join(', ');

  const locationNode = resolveLocationFromNode(node);

  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginBottom: SPACING['M'],
        },
        marginBottom: SPACING['2XL'],
      }}
    >
      {shouldDisplayHours && (
        <p>
          <IconText icon="access_time">
            <span>
              <Hours node={node} />
              <span css={{ display: 'block' }}>
                <LocationAnchoredLink node={locationNode} />
              </span>
            </span>
          </IconText>
        </p>
      )}
      {floorPlan && (
        <p>
          <IconText d={icons['address']}>
            <span>
              {locationSummary}
              <span css={{ display: 'block' }}>
                <Link to={floorPlan.fields.slug}>View floorplan</Link>
              </span>
            </span>
          </IconText>
        </p>
      )}
      {phone_number && (
        <p>
          <IconText d={icons['phone']}>
            <Link to={`tel:+1-${phone_number}`}>{phone_number}</Link>
          </IconText>
        </p>
      )}
      {email && (
        <p>
          <IconText icon="mail_outline">
            <Link to={`mailto:${email}`}>{email}</Link>
          </IconText>
        </p>
      )}
    </div>
  );
}
