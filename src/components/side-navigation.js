import React from 'react'
import { Link } from 'gatsby'
import {
  Heading,
  SPACING,
  LINK_STYLES,
  COLORS
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
      <ol css={{ marginTop: SPACING['M'] }}>
        {items.map(({ to, text }) =>
          <li key={to + text}>
            <SideNavLink to={to}><span><span className="text">{text}</span></span></SideNavLink>
          </li>
        )}
      </ol>
    </nav>
  )
}