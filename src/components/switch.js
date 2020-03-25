import React, { useState } from 'react'
import { SPACING, COLORS, Z_SPACE } from '@umich-lib/core'

export default function Switch({ on, label, children, ...rest }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      css={{
        padding: SPACING['2XS'],
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        outline: 'none',
        ':focus [data-switch-track]': {
          outline: 'none',
          boxShadow: `0 0 0 3px #ffffff, 0 0 0 4px ${COLORS.neutral['400']}`,
        },
        ':hover [data-switch-track]': {
          boxShadow: `0 0 0 4px ${COLORS.neutral['100']}`,
        },
      }}
      {...rest}
    >
      <span
        role="presentation"
        data-switch-track
        css={{
          position: 'relative',
          display: 'inline-block',
          height: '24px',
          width: '48px',
          margin: SPACING['2XS'],
          marginRight: SPACING['S'],
          background: on ? COLORS.teal['400'] : COLORS.neutral['200'],
          border: `solid 1px`,
          borderColor: on ? COLORS.teal['400'] : COLORS.neutral['200'],
          borderRadius: '16px',
          '[data-switch-knob]': {
            position: 'absolute',
            display: 'inline-block',
            height: '22px',
            width: '22px',
            top: '0px',
            left: on ? 'auto' : '0px',
            right: on ? '0px' : 'auto',
            borderRadius: '50%',
            background: 'white',
          },
        }}
      >
        <span data-switch-knob />
      </span>
      {children}
    </button>
  )
}
