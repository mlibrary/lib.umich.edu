import React from 'react'
import { Link } from 'gatsby'
import {
  Heading,
  SPACING,
  LINK_STYLES,
  COLORS,
  MEDIA_QUERIES
} from '@umich-lib/core'

const activeStyle = {
  display: 'inline-block',
  borderLeft: `solid 3px ${COLORS.teal[400]}`,
  fontWeight: '800',
  paddingLeft: SPACING['S'],
  marginLeft: `calc(-${SPACING['S']} - 3px)`,
}

function SideNavLink({ to, ...rest }) {
  return (
    <Link
      to={to}
      {...rest}
      activeClassName="active"
      css={{
        display: 'block',
        cursor: 'pointer',
        paddingTop: SPACING['XS'],
        paddingBottom: SPACING['XS'],
        '&.active > span': {
          ...activeStyle
        },
        ':hover .text': {
          ...LINK_STYLES['special-subtle'][':hover']
        },
      }}
    />
  )
}

/*
  We need to reorder the nodes by Drupal uuids that
  are listed in `order`.

  This maintains the child/parent order menu system
  that content editors set in the CMS.
*/
function OrderNodes(order, nodes) {
  return order.map(id => nodes.find(({ node }) => node.drupal_id === id))
}

export default function SideNavigation({
  parent,
  parentOrder,
  data
}) {
  if (!parent || !data) {
    return null
  }

  const nodes = OrderNodes(parentOrder, data.edges)

  /*
    Process source data for the component
  */
  const items = nodes.map(({ node }) => {
    return {
      text: node.title,
      to: node.fields.slug
    }
  })

  return (
    <nav css={{
      display: 'none',
      [MEDIA_QUERIES.LARGESCREEN]: {
        display: 'block'
      }
    }}>
      <Heading size="S" level={2}>{parent[0].title}</Heading>
      <ol css={{ marginTop: SPACING['M'], marginBottom: SPACING['L'] }}>
        {items.map(({ to, text }) =>
          <li key={to + text}>
            <SideNavLink to={to}><span><span className="text">{text}</span></span></SideNavLink>
          </li>
        )}
      </ol>
    </nav>
  )
}