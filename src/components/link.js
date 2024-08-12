import { Link as DSLink, LINK_STYLES } from '../reusable';
import { Link as GatsbyLink } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const Link = ({ to, kind = 'default', ...other }) => {
  /*
   *The check if the href is an internal link.
   */
  if (to.startsWith('/')) {
    return <GatsbyLink to={to} css={{ ...LINK_STYLES[kind] }} {...other} />;
  }

  // A regular anchor link. Probably an external link.
  return <DSLink href={to} {...other} kind={kind} />;
};

Link.propTypes = {
  kind: PropTypes.string,
  to: PropTypes.string
};

export default Link;
