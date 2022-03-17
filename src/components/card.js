import React from 'react';
import { Card as CoreCard } from '@reusable';
import { Link } from 'gatsby';

export default function Card({ href, ...rest }) {
  if (href.startsWith('/')) {
    return (
      <CoreCard
        renderAnchor={({ anchorStyles, children }) => {
          return (
            <Link css={anchorStyles} to={href}>
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
