import React from 'react'

import {
  SPACING,
  COLORS,
  Margins
} from '@umich-lib/core'

export default function HorizontalNavigation() {
  return (
    <nav css={{
      borderTop: `solid 1px ${COLORS.neutral['100']}`,
      background: COLORS.blue['100'],
      paddingTop: SPACING['L'],
      paddingBottom: SPACING['L']
    }}>
      <Margins>
        [TODO: horizontal nav]
      </Margins>
    </nav>
  )
}