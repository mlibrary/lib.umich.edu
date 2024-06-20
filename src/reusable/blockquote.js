import { COLORS, SPACING, TYPOGRAPHY } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export default function Blockquote ({ children }) {
  return (
    <blockquote
      css={{
        ...TYPOGRAPHY.XS,
        borderLeft: `solid 4px ${COLORS.teal['400']}`,
        fontStyle: 'italic',
        margin: `${SPACING.XL}!important`,
        maxWidth: '38rem',
        paddingLeft: SPACING.M
      }}
    >
      {children}
    </blockquote>
  );
}

Blockquote.propTypes = {
  children: PropTypes.node
};
