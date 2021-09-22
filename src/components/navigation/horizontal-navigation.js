import React from 'react'

import { Link } from 'gatsby'
import {
  SPACING,
  COLORS,
  Margins,
  MEDIA_QUERIES,
  LargeScreen,
  SmallScreen,
} from '@reusable'

export default function HorizontalNavigation({ items, ...rest }) {
  if (!items) {
    return null
  }

  return (
    <nav
      css={{
        marginBottom: SPACING['XL'],
        borderBottom: `solid 1px ${COLORS.neutral['100']}`,
        background: COLORS.blue['100'],
        zIndex: '1',
      }}
      {...rest}
      aria-label="Local"
    >
      <Margins
        css={{
          padding: '0',
          [MEDIA_QUERIES.LARGESCREEN]: {
            padding: `0 ${SPACING['2XL']}`,
          },
        }}
      >
        <ol>
          {items.map(({ to, text }, i) => (
            <li
              key={i + to}
              css={{
                borderTop: `solid 1px ${COLORS.neutral['100']}`,
                [MEDIA_QUERIES.LARGESCREEN]: {
                  display: 'inline-block',
                  marginRight: SPACING['L'],
                  border: 'none',
                },
              }}
            >
              <LargeScreen>
                <Link
                  css={{
                    display: 'inline-block',
                    paddingTop: SPACING['L'],
                    paddingBottom: `calc(${SPACING['L']} - 4px)`,
                  }}
                  activeStyle={{
                    fontWeight: '700',
                    borderBottom: `solid 4px ${COLORS.teal['400']}`,
                  }}
                  to={to}
                >
                  {text}
                </Link>
              </LargeScreen>
              <SmallScreen>
                <Link
                  css={{
                    display: 'block',
                    paddingTop: SPACING['M'],
                    paddingBottom: SPACING['M'],
                    paddingLeft: `calc(${SPACING['M']} - 4px)`,
                  }}
                  activeStyle={{
                    fontWeight: '700',
                    borderLeft: `solid 4px ${COLORS.teal['400']}`,
                    background: COLORS.teal['100'],
                    color: COLORS.teal['400'],
                  }}
                  to={to}
                >
                  {text}
                </Link>
              </SmallScreen>
            </li>
          ))}
        </ol>
      </Margins>
    </nav>
  )
}
