import { Heading, Icon, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export default function Callout ({ title, children, intent, alert, ...rest }) {
  return (
    <div
      css={{
        border: `solid 1px var(--color-neutral-100)`,
        borderLeft: `solid 4px ${
          intent === 'warning' ? 'var(--color-maize-400)' : 'var(--color-teal-400)'
        }`,
        borderRadius: '4px',
        margin: `${SPACING.XL} 0`,
        padding: SPACING.L
      }}
      {...rest}
      data-umich-lib-callout
    >
      <div
        css={{
          display: 'grid',
          gridGap: SPACING.S,
          gridTemplateColumns: 'auto 1fr'
        }}
      >
        {intent === 'warning' && (
          <Icon
            icon='error'
            size={24}
            css={{
              color: 'var(--color-maize-500)',
              marginTop: SPACING['2XS']
            }}
          />
        )}
        <div role={alert ? '' : 'status'}>
          {title && <Heading size='M'>{title}</Heading>}
          {children}
        </div>
      </div>
    </div>
  );
}

Callout.propTypes = {
  alert: PropTypes.bool,
  children: PropTypes.any,
  intent: PropTypes.string,
  title: PropTypes.string
};
