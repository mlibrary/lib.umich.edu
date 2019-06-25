import React from 'react'
import { Link } from 'gatsby'
import {
  Heading,
  SPACING,
  LINK_STYLES
} from '@umich-lib/core'

export default function({ parent, data }) {

  if (!parent || !data) {
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
      <Heading size="S" level={2}>{parent[0].title}</Heading>
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