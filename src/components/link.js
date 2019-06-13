import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import {
  Link as DSLink,
  LINK_STYLES
} from '@umich-lib/core'

function Link({ to, kind = 'default', ...other }) {
  /*
    The check if the href is an internal link.
  */
  if (to.startsWith('/')) {
    return (
      <GatsbyLink
        to={to}
      ><span css={{
        ...LINK_STYLES[kind]
      }} {...other} /></GatsbyLink>
    )
  }

  // A regular anchor link. Probably an external link.
  return (
    <DSLink href={to} {...other} />
  )
}

export default Link