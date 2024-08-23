import { COLORS, Heading, Icon, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export default function Callout ({ title, children, intent, alert, ...rest }) {
  return (
    <div
      css={{
        border: `solid 1px var(--colors-neutral-100)`,
        borderLeft: `solid 4px ${
          intent === 'warning' ? 'var(--colors-maize-400)' : 'var(--colors-teal-400)'
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
            d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
            size={24}
            css={{
              color: 'var(--colors-maize-500)',
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
