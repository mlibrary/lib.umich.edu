import { Icon, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';
import { SPACE_FEATURES_ICON_MAP } from '../constants/space-features';

const formatFeatureLabel = (feature) => {
  return feature
    .replace(/_/ug, ' ')
    .replace(/^./u, (str) => {
      return str.toUpperCase();
    });
};

const SpaceFeaturesIcons = ({ spaceFeatures, inline }) => {
  return (
    <ul
      css={{
        listStyle: 'none',
        margin: `${SPACING.XS} 0`
      }}
    >
      {spaceFeatures.map((feature, index) => {
        const icon = SPACE_FEATURES_ICON_MAP[feature];
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
