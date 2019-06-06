import React from 'react'
import { Link } from 'gatsby'
import {
  SPACING,
  LINK_STYLES
} from '@umich-lib/core'

export default function({ data }) {
  if (!data) {
    return null
  }

  /*
    Process source data for the component
  */
 const items = data.edges.map(({ node }) => {
   return {
     text: node.title,
     to: node.fields.slug
   }
 })

  return (
    <nav>
      <ol>
        {items.map(({ to, text }) =>
          <li><Link to={to} css={{
            display: 'block',
            fontWeight: '600',
            padding: `${SPACING['XS']} 0`,
            ':hover > span': LINK_STYLES['list-strong'][':hover']
          }}><span>{text}</span></Link></li>
        )}
      </ol>
    </nav>
  )
}