import { Heading, Icon, SPACING, Text } from '../reusable';
import Address from './address';
import Hours from './todays-hours';
import icons from '../reusable/icons';
import Link from './link';
import LocationAnchoredLink from './location-anchored-link';
import PropTypes from 'prop-types';
import React from 'react';

const LayoutWithIcon = ({
  // eslint-disable-next-line react/prop-types
  d: data,
  color,
  palette,
  children
}) => {
  return (
    <div
      css={{
        display: 'flex'
      }}
    >
      <div
        css={{
          marginRight: SPACING.S
        }}
      >
        <span
          css={{
            alignItems: 'center',
            background: `var(--color-${palette}-100)`,
            borderRadius: '50%',
            color: `var(--color-${palette}-${color})`,
            display: 'flex',
            height: '2.5rem',
            justifyContent: 'center',
            width: '2.5rem'
          }}
        >
          <Icon d={data} size={24} />
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
};

LayoutWithIcon.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  data: PropTypes.string,
  palette: PropTypes.string
};

export default function LocationAside ({ node }) {
  const {
    field_phone_number: fieldPhoneNumber,
    field_email: fieldEmail,
    relationships
  } = node;

  const buildingNode = relationships?.field_room_building;
  const parentLocationNode = relationships?.field_parent_location?.relationships?.field_parent_location;
  const locationNode = buildingNode ?? parentLocationNode ?? node;
  const floorPlans = relationships?.field_floor_plan;

  return (
    <React.Fragment>
      <section
        aria-labelledby='todays-hours'
        css={{
          marginBottom: SPACING['3XL']
        }}
      >
        <LayoutWithIcon d={icons.clock} palette='indigo' color='400'>
          <Heading
            level={2}
            size='M'
            id='todays-hours'
            css={{
              paddingBottom: SPACING['2XS'],
              paddingTop: SPACING['2XS']
            }}
          >
            Hours
          </Heading>
          <Text>
            <Hours node={node} />
          </Text>
          <LocationAnchoredLink node={locationNode} />
        </LayoutWithIcon>
      </section>
      <address
        aria-label='Address and contact information'
        css={{
          '> *:not(:last-child)': {
            marginBottom: SPACING['3XL']
          }
        }}
      >
        <LayoutWithIcon d={icons.address} palette='orange' color='500'>
          <Heading
            level={2}
            size='M'
            css={{
              paddingBottom: SPACING['2XS'],
              paddingTop: SPACING['2XS']
            }}
          >
            Address
          </Heading>
          <Address node={node} directions={true} kind='full' />
        </LayoutWithIcon>

        <LayoutWithIcon d={icons.phone} palette='green' color='500'>
          <Heading
            level={2}
            size='M'
            css={{
              paddingBottom: SPACING['2XS'],
              paddingTop: SPACING['2XS']
            }}
          >
            Contact
          </Heading>
          <div css={{ '> p': { marginBottom: SPACING['2XS'] } }}>
            {fieldPhoneNumber && (
              <p>
                <Link to={`tel:${fieldPhoneNumber}`}>
                  {fieldPhoneNumber}
                </Link>
              </p>
            )}
            {fieldEmail && (
              <p>
                <Link to={`mailto:${fieldEmail}`}>{fieldEmail}</Link>
              </p>
            )}
          </div>
        </LayoutWithIcon>
        {floorPlans?.length > 0 && (
          <LayoutWithIcon d={icons.map} palette='teal' color='500'>
            <Heading
              level={2}
              size='M'
              css={{
                paddingBottom: SPACING['2XS'],
                paddingTop: SPACING['2XS']
              }}
            >
              Floor Plan{floorPlans?.length > 1 && 's'}
            </Heading>
            <ul css={{ '> li': { marginBottom: SPACING['2XS'] } }}>
              {floorPlans.map((floorPlan, index) => {
                return (
                  <li key={index}>
                    <Link to={floorPlan.fields.slug}>
                      {floorPlan.fields.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </LayoutWithIcon>
        )}
      </address>
    </React.Fragment>
  );
}

/* eslint-disable camelcase */
LocationAside.propTypes = {
  node: PropTypes.shape({
    field_email: PropTypes.any,
    field_phone_number: PropTypes.any,
    relationships: PropTypes.shape({
      field_parent_location: PropTypes.shape({
        relationships: PropTypes.shape({
          field_parent_location: PropTypes.any
        })
      }),
      field_room_building: PropTypes.any
    })
  })
};
