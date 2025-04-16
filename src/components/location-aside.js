import { Heading, Icon, SPACING, Text } from '../reusable';
import Address from './address';
import { getFloor } from '../utils';
import Hours from './todays-hours';
import Link from './link';
import LocationAnchoredLink from './location-anchored-link';
import PropTypes from 'prop-types';
import React from 'react';
import useFloorPlan from '../hooks/use-floor-plan';

const LayoutWithIcon = ({
  // eslint-disable-next-line react/prop-types
  icon,
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
          <Icon icon={icon} size={24} />
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

export default function LocationAside ({ node, isStudySpaceAside = false }) {
  const { field_phone_number: fieldPhoneNumber, field_parent_location: fieldParentLocation, field_room_building: fieldRoomBuilding, field_email: fieldEmail, field_noise_level: noiseLevel, field_space_features: spaceFeatures, relationships } = node;
  const buildingNode = node.relationships?.field_room_building;
  const fid = node.relationships?.field_floor?.id;
  const parentLocationNode = relationships?.field_parent_location?.relationships?.field_parent_location;
  const locationNode = buildingNode ?? parentLocationNode ?? node;
  const locationTitle = relationships?.field_parent_location?.title;
  const maybeFloorPlan = useFloorPlan(buildingNode?.id, fid);
  let floorPlans = relationships?.field_floor_plan;
  const floor = getFloor({ node });
  if (floor && floorPlans.length === 0) {
    floorPlans = maybeFloorPlan;
  }
  const normalizedFloorPlans = Array.isArray(floorPlans)
    ? floorPlans
    : floorPlans
      ? [floorPlans]
      : [];

  return (
    <React.Fragment>
      {isStudySpaceAside
        ? (
            <>
              <section aria-labelledby='location' css={{ marginBottom: SPACING['3XL'] }}>
                <LayoutWithIcon icon='address' palette='orange' color='500'>
                  <Heading level={2} size='M' id='location' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
                    Location
                  </Heading>
                  <Text>
                    {locationTitle && <>{locationTitle}{floor && ', '}</>}
                    {floor}
                  </Text>
                  <ul>
                    {normalizedFloorPlans.map((floorPlan, index) => {
                      return (
                        <li key={index}>
                          <Link to={floorPlan.fields.slug}>
                            {maybeFloorPlan ? 'View floor plan' : floorPlan.fields.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </LayoutWithIcon>
              </section>

              <HoursSection node={node} locationNode={locationNode} />

              <section
                aria-labelledby='noise-level'
                css={{
                  marginBottom: spaceFeatures?.length > 0 ? SPACING['3XL'] : '0'
                }}
              >
                <LayoutWithIcon icon='volume_up' palette='green' color='500'>
                  <Heading level={2} size='M' id='noise-level' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
                    Noise Level
                  </Heading>
                  <Text>
                    {noiseLevel.replace(/_/ug, ' ').replace(/^./u, (str) => {
                      return str.toUpperCase();
                    })}
                  </Text>
                </LayoutWithIcon>
              </section>
              {spaceFeatures?.length > 0 && (
                <section aria-labelledby='features'>
                  <LayoutWithIcon icon='info_outline' palette='teal' color='500'>
                    <Heading level={2} size='M' id='features' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
                      Features
                    </Heading>
                    <SpaceFeatures spaceFeatures={spaceFeatures}></SpaceFeatures>
                  </LayoutWithIcon>
                </section>
              )}
            </>
          )
        : (
            <>
              <HoursSection node={node} locationNode={locationNode} />

              <address
                aria-label='Address and contact information'
                css={{
                  '> *:not(:last-child)': {
                    marginBottom: SPACING['3XL']
                  }
                }}
              >
                <LayoutWithIcon icon='address' palette='orange' color='500'>
                  <Heading level={2} size='M' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
                    Address
                  </Heading>
                  <Address node={node} directions={true} kind='full' />
                </LayoutWithIcon>

                <LayoutWithIcon icon='phone' palette='green' color='500'>
                  <Heading level={2} size='M' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
                    Contact
                  </Heading>
                  <div css={{ '> p': { marginBottom: SPACING['2XS'] } }}>
                    {fieldPhoneNumber && (
                      <p>
                        <Link to={`tel:${fieldPhoneNumber}`}>{fieldPhoneNumber}</Link>
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
                  <LayoutWithIcon icon='map' palette='teal' color='500'>
                    <Heading level={2} size='M' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
                      Floor plans
                    </Heading>
                    <ul css={{ '> li': { marginBottom: SPACING['2XS'] } }}>
                      {floorPlans.map((floorPlan, index) => {
                        return (
                          <li key={index}>
                            <Link to={floorPlan.fields.slug}>{floorPlan.fields.title}</Link>
                          </li>
                        );
                      })}
                    </ul>
                  </LayoutWithIcon>
                )}
              </address>
            </>
          )}
    </React.Fragment>
  );
}

/* eslint-disable camelcase */
LocationAside.propTypes = {
  isStudySpaceAside: PropTypes.bool,
  node: PropTypes.shape({
    field_email: PropTypes.any,
    field_noise_level: PropTypes.string,
    field_phone_number: PropTypes.any,
    field_space_features: PropTypes.any,
    relationships: PropTypes.shape({
      field_floor_plan: PropTypes.shape({
        length: PropTypes.number,
        map: PropTypes.func
      }),
      field_parent_location: PropTypes.shape({
        relationships: PropTypes.shape({
          field_parent_location: PropTypes.any
        }),
        title: PropTypes.any
      }),
      field_room_building: PropTypes.any
    })
  })
};

const SpaceFeatures = ({ spaceFeatures }) => {
  const iconMap = {
    all_gender_restroom_on_floor: 'person_half_dress',
    external_monitors: 'desktop_windows',
    natural_light: 'sunny',
    wheelchair_accessible: 'wheelchair',
    whiteboards: 'stylus_note'
  };

  return (
    <ul css={{
      listStyle: 'none',
      margin: `${[SPACING.XS]} 0`
    }}
    >
      {spaceFeatures.map((feature, index) => {
        const icon = iconMap[feature];
        if (!icon) {
          return null;
        }

        return (
          <li
            key={index}
            css={{
              alignItems: 'center',
              display: 'flex',
              gap: [SPACING.XS],
              margin: `${[SPACING.XS]} 0`
            }}
          >
            <Icon icon={icon} size={24} title={feature.replace(/_/ug, ' ')} />
            <span>
              {feature.replace(/_/ug, ' ').replace(/^./u, (str) => {
                return str.toUpperCase();
              })}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

SpaceFeatures.propTypes = {
  spaceFeatures: PropTypes.shape({
    map: PropTypes.func
  })
};

const HoursSection = ({ node, locationNode }) => {
  return (
    <section aria-labelledby='todays-hours' css={{ marginBottom: SPACING['3XL'] }}>
      <LayoutWithIcon icon='access_time' palette='indigo' color='400'>
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
  );
};

HoursSection.propTypes = {
  locationNode: PropTypes.any,
  node: PropTypes.any
};
