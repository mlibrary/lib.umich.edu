import React from 'react'
import {
  SPACING,
  TYPOGRAPHY,
  COLORS
} from '@umich-lib/core'

function SmallScreenHeader({
  primary,
  secondary
}) {

  return null

  return (
    <nav>
      {primary && (
        <NavPrimary items={primary} />
      )}
    </nav>
  )
}

function NavPrimary({ items }) {

  return (
    <ul>
      {items.map((item, i) =>
        <NavPrimaryItem {...item} />
      )}
    </ul>
  )
}

function NavPrimaryItem({ to, text, children }) {
  return (
    <li>
      <button
        css={{
          padding: SPACING['M']
        }}
      >
        {text}
      </button>
    </li>
  )
}

export default SmallScreenHeader