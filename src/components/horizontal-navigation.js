import React from 'react'

import { Link } from 'gatsby'
import {
  SPACING,
  COLORS,
  Margins
} from '@umich-lib/core'

import OrderNodes from './utilities/order-nodes'

export default function HorizontalNavigation({
  data,
  parentOrder
}) {
  /*
    Re order the nodes and filter out undefined ones.
  */
  const nodes = OrderNodes(parentOrder, data.edges)
    .filter(node => node !== undefined)

  /*
    Make a list of { to, text } objs for rendering.
  */
  const items = nodes.map(({ node }) => {
    return {
      to: node.fields.slug,
      text: node.field_horizontal_nav_title || node.title
    }
  })

  return (
    <nav css={{
      borderTop: `solid 1px ${COLORS.neutral['100']}`,
      borderBottom: `solid 1px ${COLORS.neutral['100']}`,
      background: COLORS.blue['100'],
      marginBottom: SPACING['2XL']
    }}>
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