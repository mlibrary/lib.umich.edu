import { getBuildingSlug, getFloor } from '../utils';
import { Heading, Icon, SPACING, Text } from '../reusable';
import Address from './address';
import Hours from './todays-hours';
import Link from './link';
import LocationAnchoredLink from './location-anchored-link';
import PropTypes from 'prop-types';
import React from 'react';
import SpaceFeaturesIcons from './space-features-list';
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
  const {
    field_phone_number: fieldPhoneNumber,
    field_room_number: fieldRoomNumber,
    field_email: fieldEmail,
    field_noise_level: noiseLevel,
    field_space_features: spaceFeatures,
    relationships } = node;
  const buildingNode = relationships?.field_room_building;
  const parentLocationNode = relationships?.field_parent_location;
  const buildingSlug = getBuildingSlug({ node });
  const locationNode = buildingNode ?? parentLocationNode?.relationships?.field_parent_location ?? node;
  const locationTitle = buildingNode?.title ?? parentLocationNode?.title;
  const floor = getFloor({ node });
  const fid = node.relationships?.field_floor?.id;
  const maybeFloorPlan = useFloorPlan(buildingNode?.id ?? parentLocationNode?.id, fid);
  let floorPlans = relationships?.field_floor_plan;
  if (floor && floorPlans.length === 0) {
    floorPlans = maybeFloorPlan;
  }
  let normalizedFloorPlans = [];
  if (Array.isArray(floorPlans)) {
    normalizedFloorPlans = floorPlans;
  } else if (floorPlans) {
    normalizedFloorPlans = [floorPlans];
  }
  if (isStudySpaceAside) {
    return (
      <>
        <StudySpaceLocationSection {...{
          buildingSlug,
          floor,
          locationTitle,
          maybeFloorPlan,
          normalizedFloorPlans,
          roomNumber: fieldRoomNumber
        }}
        />
        <HoursSection node={node} locationNode={locationNode} />
        <NoiseLevelSection noiseLevel={noiseLevel} spaceFeatures={spaceFeatures} />
        {spaceFeatures?.length > 0 && <SpaceFeaturesSection spaceFeatures={spaceFeatures} />}
      </>
    );
  }

  return (
    <>
      <HoursSection node={node} locationNode={locationNode} />
      <AddressSection node={node} fieldPhoneNumber={fieldPhoneNumber} fieldEmail={fieldEmail}></AddressSection>
      <FloorPlanSection floorPlans={normalizedFloorPlans} />
    </>
  );
}

/* eslint-disable camelcase */
LocationAside.propTypes = {
  isStudySpaceAside: PropTypes.bool,
  node: PropTypes.shape({
    field_email: PropTypes.any,
    field_noise_level: PropTypes.any,
    field_phone_number: PropTypes.any,
    field_room_number: PropTypes.any,
    field_space_features: PropTypes.array,
    relationships: PropTypes.shape({
      field_floor: PropTypes.shape({
        id: PropTypes.any
      }),
      field_floor_plan: PropTypes.array,
      field_parent_location: PropTypes.shape({
        relationships: PropTypes.shape({
          field_parent_location: PropTypes.any
        }),
        title: PropTypes.any
      }),
      field_room_building: PropTypes.shape({
        id: PropTypes.any,
        title: PropTypes.any
      })
    })
  })
};
/* eslint-enable camelcase */

const AddressSection = ({ node, fieldPhoneNumber, fieldEmail }) => {
  return (
    <>
      <address
        aria-label='Address and contact information'
      >
        <div css={{
          marginBottom: SPACING['3XL']
        }}
        >
          <LayoutWithIcon icon='address' palette='orange' color='500'>
            <Heading level={2} size='M' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
              Address
            </Heading>
            <Address node={node} directions={true} kind='full' />
          </LayoutWithIcon>
        </div>

        <div css={{
          marginBottom: SPACING['3XL']
        }}
        >
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
        </div>
      </address>
    </>
  );
};

AddressSection.propTypes = {
  fieldEmail: PropTypes.any,
  fieldPhoneNumber: PropTypes.any,
  node: PropTypes.any
};

const FloorPlanSection = ({ floorPlans }) => {
  if (!floorPlans || floorPlans.length === 0) {
    return null;
  }
  return (
    <section aria-label='floor plans'>
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
    </section>
  );
};

FloorPlanSection.propTypes = {
  floorPlans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  )
};

const SpaceFeaturesSection = ({ spaceFeatures }) => {
  console.log(spaceFeatures);
  if (!spaceFeatures?.length) {
    return null;
  }
  return (
    <section aria-labelledby='features'>
      <LayoutWithIcon icon='info_outline' palette='teal' color='500'>
        <Heading level={2} size='M' id='features' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
          Features
        </Heading>
        <SpaceFeaturesIcons spaceFeatures={spaceFeatures} inline={false} />
      </LayoutWithIcon>
    </section>
  );
};

SpaceFeaturesSection.propTypes = {
  spaceFeatures: PropTypes.array
};

const NoiseLevelSection = ({ noiseLevel, spaceFeatures }) => {
  if (!noiseLevel) {
    return null;
  }

  return (
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
  );
};

NoiseLevelSection.propTypes = {
  noiseLevel: PropTypes.string,
  spaceFeatures: PropTypes.array
};

const getFloorPlanContent = (normalizedFloorPlans, maybeFloorPlan) => {
  if (!normalizedFloorPlans?.length && !maybeFloorPlan) {
    return null;
  }

  if (normalizedFloorPlans.length > 1) {
    return (
      <ul>
        {normalizedFloorPlans.map((floorPlan, index) => {
          return (
            <li key={index}>
              <Link to={floorPlan.fields.slug}>
                {floorPlan.fields.title}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <Link to={normalizedFloorPlans[0].fields.slug}>
      {maybeFloorPlan ? 'View floor plan' : normalizedFloorPlans[0].fields.title}
    </Link>
  );
};

const StudySpaceLocationSection = ({ buildingSlug, locationTitle, floor, roomNumber, normalizedFloorPlans, maybeFloorPlan }) => {
  if (!locationTitle && !floor && !normalizedFloorPlans?.length) {
    return null;
  }

  return (
    <section aria-labelledby='location' css={{ marginBottom: SPACING['3XL'] }}>
      <LayoutWithIcon icon='address' palette='orange' color='500'>
        <Heading level={2} size='M' id='location' css={{ paddingBottom: SPACING['2XS'], paddingTop: SPACING['2XS'] }}>
          Location
        </Heading>
        <Text>
          {[locationTitle, floor, roomNumber].filter(Boolean).join(', ')}
        </Text>
        {buildingSlug && (
          <Text>
            <Link to={`${buildingSlug}`}>
              View building information
            </Link>
          </Text>
        )}
        {getFloorPlanContent(normalizedFloorPlans, maybeFloorPlan)}
      </LayoutWithIcon>
    </section>
  );
};

StudySpaceLocationSection.propTypes = {
  buildingSlug: PropTypes.string,
  floor: PropTypes.any,
  locationTitle: PropTypes.any,
  maybeFloorPlan: PropTypes.any,
  normalizedFloorPlans: PropTypes.array,
  roomNumber: PropTypes.any
};

const SpaceFeatures = ({ spaceFeatures }) => {
  return <SpaceFeaturesIcons spaceFeatures={spaceFeatures} />;
};

SpaceFeatures.propTypes = {
  spaceFeatures: PropTypes.array
};

const HoursSection = ({ node, locationNode }) => {
  if (!locationNode) {
    return null;
  }

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
