import React from 'react'
import CoreCard from '../maybe-design-system/card'
import { Link } from 'gatsby'

export default function Card({ href, ...rest }) {
  if (href.startsWith('/')) {
    return (
      <CoreCard
        renderAnchor={({ anchorStyles, children }) => {
          return (
            <Link css={anchorStyles} to={href}>
              {children}
            </Link>
          )
        }}
        {...rest}
      />
    )
  }

  return <CoreCard href={href} {...rest} />
}
