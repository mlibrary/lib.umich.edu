import React from 'react'
import { COLORS, SPACING, Icon } from '@umich-lib/core'

export default function Select({ label, name, options, value, ...rest }) {
  return (
    <label>
      <span
        css={{
          display: 'block',
          marginBottom: SPACING['XS'],
        }}
      >
        {label}
      </span>
      <div
        css={{
          position: 'relative',
        }}
      >
        <select
          name={name}
          css={{
            // reset default <select> styles.
            display: 'block',
            width: '100%',
            appearance: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            boxShadow: 'none',
            background: 'transparent',
            backgroundImage: 'none',
            padding: `${SPACING['XS']} ${SPACING['XS']}`,
            paddingRight: `2rem`,
            border: `solid 1px ${COLORS.neutral['300']}`,
            borderRadius: '4px',
            lineHeight: '1.5',
            height: '40px',
          }}
          value={value ? value : 'All'}
          {...rest}
        >
          {options.map((opt, i) => (
            <option key={opt + i} id={name + opt} value={opt}>
              {opt}
            </option>
          ))}
          c
        </select>
        <Icon
          icon="expand_more"
          css={{
            position: 'absolute',
            right: SPACING['S'],
            bottom: SPACING['S'],
            pointerEvents: 'none',
          }}
        />
      </div>
    </label>
  )
}
