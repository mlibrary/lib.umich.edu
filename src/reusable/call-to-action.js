import { Icon, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export default function CallToAction ({ children, ...rest }) {
  return (
    <div
      css={{
        backgroundColor: 'var(--color-indigo-100)',
        border: '1px solid var(--color-neutral-100)',
        borderRadius: '4px',
        fontWeight: 'bold',
        maxWidth: '38rem',
        padding: `${SPACING.M} ${SPACING.L} ${SPACING.M} ${SPACING.M}`,
        width: 'fit-content'
      }}
      data-umich-cta
      {...rest}
    >
      <Icon icon='web_traffic' size={24} /> {children}
    </div>
  );
};

CallToAction.propTypes = {
  children: PropTypes.any
};
