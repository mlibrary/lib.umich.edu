import { Card as CoreCard } from '../reusable';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

export default function Card ({ href, state, ...rest }) {
  if (href.startsWith('/')) {
    return (
      <CoreCard
        renderAnchor={({ anchorStyles, children }) => {
          return (
            <Link css={anchorStyles} to={href} state={state}>
              {children}
            </Link>
          );
        }}
        {...rest}
      />
    );
  }

  return <CoreCard href={href} {...rest} />;
}

Card.propTypes = {
  href: PropTypes.string,
  state: PropTypes.object
};
