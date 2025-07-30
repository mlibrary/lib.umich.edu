import { Icon, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

const iconMap = {
  /* eslint-disable camelcase */
  all_gender_restroom_on_floor: 'person_half_dress',
  bookable: 'calendar_month',
  external_monitors: 'desktop_windows',
  natural_light: 'sunny',
  wheelchair_accessible: 'wheelchair',
  whiteboards: 'stylus_note'
  /* eslint-enable camelcase */
};

const formatFeatureLabel = (feature) => {
  return feature
    .replace(/_/ug, ' ')
    .replace(/^./u, (str) => {
      return str.toUpperCase();
    });
};

const SpaceFeaturesIcons = ({ spaceFeatures, inline }) => {
  console.log(spaceFeatures);
  return (
    <ul
      css={{
        listStyle: 'none',
        margin: `${SPACING.XS} 0`
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
              gap: SPACING.XS,
              ...(inline
                ? {
                    display: 'inline-flex',
                    flexDirection: 'row',
                    margin: `0 ${[SPACING.XS]} ${[SPACING.XS]} 0`
                  }
                : {
                    display: 'flex',
                    margin: `${SPACING.XS} 0`
                  })
            }}
          >
            <Icon icon={icon} size={18} css={{ color: 'var(--color-teal-400)' }} />
            <span>{formatFeatureLabel(feature)}</span>
          </li>
        );
      })}
    </ul>
  );
};

SpaceFeaturesIcons.propTypes = {
  inline: PropTypes.bool,
  spaceFeatures: PropTypes.array.isRequired
};

export default SpaceFeaturesIcons;
