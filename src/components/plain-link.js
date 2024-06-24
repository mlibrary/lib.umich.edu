import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const PlainLink = ({ to, children, external, ...other }) => {
  /*
   *The check if the href is an internal link.
   */
  if (to.startsWith('/') && !external) {
    return (
      <Link to={to} {...other}>
        {children}
      </Link>
    );
  }

  // A regular anchor link. Probably an external link.
  return (
    <a href={to} {...other}>
      {children}
    </a>
  );
};

PlainLink.propTypes = {
  children: PropTypes.node,
  external: PropTypes.bool,
  to: PropTypes.string
};

export default PlainLink;
