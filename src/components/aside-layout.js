import React from 'react'

import {
  SPACING,
  COLORS,
  Margins
} from '@umich-lib/core'

import MEDIA_QUERIES from '../maybe-design-system/media-queries'

export function Template({ children, ...rest }) {
  return (
    <Margins>
      <div
        css={{
          paddingBottom: SPACING['XL'],
          [MEDIA_QUERIES['L']]: {
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
        [MEDIA_QUERIES['L']]: {
          gridArea: 'side'
        },
      }}
      {...rest}
    >
      <div css={{
        [MEDIA_QUERIES['L']]: {
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
        [MEDIA_QUERIES['L']]: {
          maxWidth: '38rem',
          gridArea: 'content',
          marginRight: SPACING['2XL'],
        },
        marginBottom: SPACING['XL']
      }}
      {...rest}
    >
      {children}
    </div>
  )
}