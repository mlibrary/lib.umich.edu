import React from 'react'

import { SPACING, COLORS, TYPOGRAPHY } from '@umich-lib/core'

export default function Blockquote({ children, ...rest }) {
  return (
    <blockquote
      css={{
        ...TYPOGRAPHY['XS'],
        margin: SPACING['XL'] + '!important',
        paddingLeft: SPACING['M'],
        borderLeft: `solid 4px ${COLORS.teal['400']}`,
        maxWidth: '38rem',
        fontStyle: 'italic',
      }}
    >
      {children}
    </blockquote>
  )
}
