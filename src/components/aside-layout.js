import React from 'react'

import {
  SPACING,
  MEDIA_QUERIES,
  COLORS,
  Margins
} from '@umich-lib/core'

export function Template({ children, ...rest }) {
  return (
    <Margins>
      <div
        css={{
          paddingTop: SPACING['XL'],
          paddingBottom: SPACING['XL'],
          [MEDIA_QUERIES.LARGESCREEN]: {
            paddingTop: SPACING['3XL'],
            paddingBottom: SPACING['3XL'],
            display: "grid",
            gridTemplateAreas: `
              "content side"
            `,
            gridTemplateColumns: `1fr calc(21rem + ${SPACING['4XL']}) `
          }
        }}
        {...rest}
      >
          {children}
      </div>
    </Margins>
  )
}

export function TemplateSide({ children, ...rest }) {
  return (
    <aside
      css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          gridArea: 'side'
        },
      }}
      {...rest}
    >
      <div css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          marginLeft: SPACING['3XL'],
          paddingLeft: SPACING['3XL'],
          borderLeft: `solid 1px ${COLORS.neutral['100']}`,
          borderBottom: 'none',
          paddingBottom: 0
        },
        borderBottom: `solid 1px ${COLORS.neutral['100']}`,
        paddingBottom: SPACING['2XL'],
        marginBottom: SPACING['2XL']
      }}>
        {children}
      </div>
    </aside>
  )
}

export function TemplateContent({ children, ...rest }) {
  return (
    <div
      css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          maxWidth: '38rem',
          gridArea: 'content',
        },
        marginBottom: SPACING['XL']
      }}
      {...rest}
    >
      {children}
    </div>
  )
}