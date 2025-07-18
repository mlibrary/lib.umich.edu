import PropTypes from 'prop-types';
import React from 'react';
import { Icon, SPACING } from '../reusable';

const iconMap = {
  all_gender_restroom_on_floor: 'person_half_dress',
  external_monitors: 'desktop_windows',
  natural_light: 'sunny',
  wheelchair_accessible: 'wheelchair',
  whiteboards: 'stylus_note'
};

function formatFeatureLabel (feature) {
  return feature
    .replace(/_/ug, ' ')
    .replace(/^./u, (str) => {
      return str.toUpperCase();
    });
}

const SpaceFeaturesList = ({ spaceFeatures, inline }) => {
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
                    gap: SPACING.XS,
                    margin: `0 ${[SPACING.XS]} ${[SPACING.XS]} 0`
                  }
                : {
                    display: 'flex',
                    gap: [SPACING.XS],
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

SpaceFeaturesList.propTypes = {
  inline: PropTypes.bool,
  spaceFeatures: PropTypes.array.isRequired
};

export default SpaceFeaturesList;
