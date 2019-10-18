import React from 'react'
import { Link } from 'gatsby'

function PlainLink({ to, ...other }) {
  /*
    The check if the href is an internal link.
  */
  if (to.startsWith('/')) {
    return (
      <Link
        to={to}
        {...other}
      />
    )
  }

  // A regular anchor link. Probably an external link.
  return (
    <a href={to} {...other} />
  )
}

export default PlainLink