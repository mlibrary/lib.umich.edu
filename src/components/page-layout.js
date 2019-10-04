import React from "react"
import {
  SPACING,
  MEDIA_QUERIES
} from '@umich-lib/core'

export function Template({ children, ...rest }) {
  return (
    <div
      css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          display: "grid",
          gridTemplateAreas: `
            "top top"
            "side content"
          `,
          gridTemplateColumns: `calc(216px + ${SPACING['4XL']}) 1fr`,
          gridTemplateRows: "auto 1fr",
        }
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export function Top({ children, ...rest }) {
  return (
    <div css={{ gridArea: 'top' }} {...rest}>
      {children}
    </div>
  )
}

export function Side({ children, ...rest }) {
  return (
    <aside
      css={{
        gridArea: 'side',
        marginRight: SPACING['3XL']
      }}
      {...rest}
    >
      {children}
    </aside>
  )
}

export function Content({ children, ...rest }) {
  return (
    <div
      css={{
        maxWidth: '38rem',
        gridArea: 'content',
        marginBottom: SPACING['XL']
      }}
      {...rest}
    >
      {children}
    </div>
  )
}