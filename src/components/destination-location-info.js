import { getFloor } from '../utils';
import Hours from '../components/todays-hours';
import IconText from '../components/icon-text';
import Link from '../components/link';
import LocationAnchoredLink from '../components/location-anchored-link';
import PropTypes from 'prop-types';
import React from 'react';
import { SPACING } from '../reusable';
import useFloorPlan from '../hooks/use-floor-plan';

export default function DestinationLocationInfoContainer ({ node }) {
  // eslint-disable-next-line no-underscore-dangle
  if (node.__typename === 'node__page') {
    return null;
  }

  return <DestinationLocationInfo node={node} />;
}

DestinationLocationInfoContainer.propTypes = {
  node: PropTypes.object
};

const resolveLocationFromNode = (node) => {
  const { relationships } = node;

  const buildingNode = relationships?.field_room_building;
  const parentLocationNode = relationships?.field_parent_location?.relationships?.field_parent_location;
  const locationNode = buildingNode || parentLocationNode || node;

  return locationNode;
};

const DestinationLocationInfo = ({ node }) => {
  const { field_parent_location: fieldParentLocation, field_room_building: fieldRoomBuilding } = node.relationships;
  const bid = fieldRoomBuilding
    ? fieldRoomBuilding.id
    : fieldParentLocation?.id;
  const fid = node.relationships.field_floor?.id;
  const floorPlan = useFloorPlan(bid, fid);
  // eslint-disable-next-line no-underscore-dangle
  const shouldDisplayHours = node.field_display_hours_;
  const locationTitle = fieldParentLocation
    ? fieldParentLocation?.title
    : fieldRoomBuilding?.title;
  const phoneNumber = node.field_phone_number;
  const email = node.field_email;
  const floor = getFloor({ node });
  const room = node.field_room_number && `Room ${node.field_room_number}`;
  const locationSummary = [locationTitle, floor, room]
    .filter((item) => {
      return typeof item === 'string';
    })
    .join(', ');

  const locationNode = resolveLocationFromNode(node);

  const { fields } = node;
  const askLibrarian = fields?.slug === '/ask-librarian';

  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginBottom: SPACING.M
        },
        marginBottom: SPACING['2XL']
      }}
    >
      {shouldDisplayHours && (
        <p>
          <IconText icon='access_time'>
            <span>
              <Hours node={node} />
              <span css={{ display: 'block' }}>
                <LocationAnchoredLink node={locationNode} />
              </span>
            </span>
          </IconText>
        </p>
      )}
      {(floorPlan || askLibrarian) && (
        <p>
          <IconText icon='address'>
            <span>
              {locationSummary}
              <span css={{ display: 'block' }}>
                {askLibrarian ? ('Online') : (<Link to={floorPlan.fields.slug}>View floor plan</Link>)}
              </span>
            </span>
          </IconText>
        </p>
      )}
      {phoneNumber && (
        <p>
          <IconText icon='phone'>
            <Link to={`tel:+1-${phoneNumber}`}>{phoneNumber}</Link>
          </IconText>
        </p>
      )}
      {email && (
        <p>
          <IconText icon='mail_outline'>
            <Link to={`mailto:${email}`}>{email}</Link>
          </IconText>
        </p>
      )}
    </div>
  );
};

DestinationLocationInfo.propTypes = {
  node: PropTypes.object
};
