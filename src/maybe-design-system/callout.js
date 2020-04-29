import React from 'react'

import { SPACING, COLORS } from '@umich-lib/core'

export default function Callout({ children, ...rest }) {
  return (
    <div
      css={{
        margin: `${SPACING['XL']} 0`,
        padding: SPACING['L'],
        border: `solid 1px ${COLORS.neutral['100']}`,
        borderLeft: `solid 4px ${COLORS.teal['400']}`,
        borderRadius: '4px',
        maxWidth: '38rem',
      }}
      data-umich-lib-callout
    >
      {children}
    </div>
  )
}
