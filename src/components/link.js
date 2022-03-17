import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { Link as DSLink, LINK_STYLES } from '@reusable';

function Link({ to, kind = 'default', ...other }) {
  /*
    The check if the href is an internal link.
  */
  if (to.startsWith('/')) {
    return <GatsbyLink to={to} css={{ ...LINK_STYLES[kind] }} {...other} />;
  }

  // A regular anchor link. Probably an external link.
  return <DSLink href={to} {...other} kind={kind} />;
}

export default Link;
