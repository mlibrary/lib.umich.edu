import { COLORS, SPACING, TYPOGRAPHY } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export default function Switch ({ on, children, ...rest }) {
  return (
    <button
      role='switch'
      aria-checked={on}
      css={{
        ':focus [data-switch-track]': {
          boxShadow: `0 0 0 3px #ffffff, 0 0 0 4px var(--colors-neutral-400)`,
          outline: 'none'
        },
        ':hover [data-switch-track]': {
          boxShadow: `0 0 0 4px var(--colors-neutral-100)`
        },
        alignItems: 'center',
        display: 'flex',
        height: '40px',
        outline: 'none',
        padding: SPACING['2XS']
      }}
      {...rest}
    >
      <span
        role='presentation'
        data-switch-track
        css={{
          '[data-switch-knob]': {
            background: 'white',
            borderRadius: '50%',
            display: 'inline-block',
            height: '20px',
            left: on ? 'auto' : '0px',
            position: 'absolute',
            right: on ? '0px' : 'auto',
            top: '0px',
            width: '20px'
          },
          '[data-switch-label]': {
            ...TYPOGRAPHY['3XS'],
            color: 'white',
            display: 'inline-block',
            fontSize: '0.675rem',
            left: on ? '8px' : 'auto',
            position: 'absolute',
            right: on ? 'auto' : '5px',
            top: '2px'
          },
          background: on ? 'var(--colors-green-500)' : COLORS.neutral['300'],
          border: `solid 2px`,
          borderColor: on ? 'var(--colors-green-500)' : COLORS.neutral['300'],
          borderRadius: '16px',
          display: 'inline-block',
          height: '24px',
          marginRight: SPACING.XS,
          position: 'relative',
          width: '58px'
        }}
      >
        <span data-switch-label>{on ? 'on' : 'off'}</span>
        <span data-switch-knob />
      </span>
      {children}
    </button>
  );
}

Switch.propTypes = {
  children: PropTypes.node,
  on: PropTypes.bool
};
