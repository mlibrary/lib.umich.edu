import React from 'react'

import { Link } from 'gatsby'
import {
  SPACING,
  COLORS,
  Margins,
  MEDIA_QUERIES,
  LargeScreen,
  SmallScreen
} from '@umich-lib/core'

export default function HorizontalNavigation({ items, ...rest }) {
  if (!items) {
    return null
  }

  return (
    <nav
      css={{
        marginBottom: SPACING['XL'],
        [MEDIA_QUERIES.LARGESCREEN]: {
          position: 'sticky',
          top: '0',
          marginBottom: SPACING['3XL']
        },
        borderBottom: `solid 1px ${COLORS.neutral['100']}`,
        background: COLORS.blue['100'],
        zIndex: '0'
      }}
      {...rest}
      aria-label="Local"
    >
      <Margins>
        <ol>
          {items.map(({ to, text }, i) => (
            <li
              key={i + to}
              css={{
                [MEDIA_QUERIES.LARGESCREEN]: {
                  display: 'inline-block',
                  marginRight: SPACING['L'],
                }
              }}
            >
              <LargeScreen>
                <Link
                  css={{
                    display: 'inline-block',
                    fontWeight: '600',
                    paddingTop: SPACING['L'],
                    paddingBottom: `calc(${SPACING['L']} - 4px)`
                  }}
                  activeStyle={{
                    borderBottom: `solid 4px ${COLORS.teal['400']}`,
                  }}
                  to={to}
                >{text}</Link>
              </LargeScreen>
              <SmallScreen>
                <Link
                  css={{
                    display: 'block',
                    fontWeight: '600',
                    paddingTop: SPACING['M'],
                    paddingBottom: SPACING['M'],
                    paddingLeft: `calc(${SPACING['M']} - 4px)`,
                    marginLeft: `-${SPACING['M']}`
                  }}
                  activeStyle={{
                    fontWeight: '700',
                    borderLeft: `solid 4px ${COLORS.teal['400']}`,
                  }}
                  to={to}
                >{text}</Link>
              </SmallScreen>
            </li>
          ))}
        </ol>
      </Margins>
    </nav>
  )
}