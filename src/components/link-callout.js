import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { LINK_STYLES, SPACING, COLORS, Icon } from '@reusable';

const linkCSS = {
  display: 'block',
  padding: SPACING['M'],
  paddingRight: SPACING['L'],
  background: COLORS.teal['100'],
  ':hover [data-link]': LINK_STYLES['description'][':hover'],
  borderRadius: '2px',
};

function Link({ to, ...other }) {
  /*
    The check if the href is an internal link.
  */
  if (to.startsWith('/')) {
    return (
      <GatsbyLink to={to} css={linkCSS}>
        <LinkContent {...other} />
      </GatsbyLink>
    );
  }

  // A regular anchor link. Probably an external link.
  return (
    <a href={to} css={linkCSS}>
      <LinkContent {...other} />
    </a>
  );
}

function LinkContent({ d, icon, children }) {
  return (
    <React.Fragment>
      <span
        css={{
          color: COLORS.teal['400'],
          marginRight: SPACING['XS'],
        }}
      >
        {d && <Icon d={d} size={24} />}
        {icon && <Icon icon={icon} size={24} />}
      </span>
      <span
        data-link
        css={{
          ...LINK_STYLES['description'],
          fontSize: '1rem',
          color: COLORS.neutral['400'],
        }}
      >
        {children}
      </span>
    </React.Fragment>
  );
}

export default Link;
