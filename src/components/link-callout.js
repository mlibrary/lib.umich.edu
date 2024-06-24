import { COLORS, Icon, LINK_STYLES, SPACING } from '../reusable';
import { Link as GatsbyLink } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const linkCSS = {
  ':hover [data-link]': LINK_STYLES.description[':hover'],
  background: COLORS.teal['100'],
  borderRadius: '2px',
  display: 'block',
  padding: SPACING.M,
  paddingRight: SPACING.L
};

const Link = ({ to, ...other }) => {
  /*
   *The check if the href is an internal link.
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
};

Link.propTypes = {
  to: PropTypes.string
};

const LinkContent = ({ d: data, icon, children }) => {
  return (
    <React.Fragment>
      <span
        css={{
          color: COLORS.teal['400'],
          marginRight: SPACING.XS
        }}
      >
        {data && <Icon d={data} size={24} />}
        {icon && <Icon icon={icon} size={24} />}
      </span>
      <span
        data-link
        css={{
          ...LINK_STYLES.description,
          color: COLORS.neutral['400'],
          fontSize: '1rem'
        }}
      >
        {children}
      </span>
    </React.Fragment>
  );
};

LinkContent.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  icon: PropTypes.string
};

export default Link;
