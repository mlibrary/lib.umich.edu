import React from 'react'

import { Link } from 'gatsby'
import {
  SPACING,
  COLORS,
  Margins
} from '@umich-lib/core'

export default function HorizontalNavigation({ items, ...rest }) {
  if (!items) {
    return null
  }

  return (
    <nav
      css={{
        borderTop: `solid 1px ${COLORS.neutral['100']}`,
        borderBottom: `solid 1px ${COLORS.neutral['100']}`,
        background: COLORS.blue['100']
      }}
      {...rest}
    >
      <Margins>
        <ol>
          {items.map(({ to, text }, i) => (
            <li
              key={i + to}
              css={{
                display: 'inline-block',
                marginRight: SPACING['L']
              }}
            >
              <Link
                css={{
                  display: 'inline-block',
                  fontWeight: '600',
                  paddingTop: SPACING['L'],
                  paddingBottom: `calc(${SPACING['L']} - 4px)`
                }}
                activeStyle={{
                  borderBottom: `solid 4px ${COLORS.teal['400']}`
                }}
                to={to}
              >{text}</Link>
            </li>
          ))}
        </ol>
      </Margins>
    </nav>
  )
}