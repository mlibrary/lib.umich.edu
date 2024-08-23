import {
  COLORS,
  Heading,
  Icon,
  LargeScreen,
  MEDIA_QUERIES,
  SPACING
} from '../../reusable';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

export default function SideNavigation ({ to, branch }) {
  if (!branch) {
    return null;
  }

  const title = branch.text;
  const items = branch.children;

  if (!items) {
    return null;
  }

  return (
    <LargeScreen>
      <nav
        css={{
          display: 'none',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'block'
          }
        }}
        aria-labelledby='side-nav-heading'
      >
        <Heading size='S' level={2} id='side-nav-heading'>
          {title}
        </Heading>
        <ol
          css={{
            '> li:not(:last-of-type)': {
              borderBottom: `solid 1px var(--colors-neutral-100)`
            },
            marginBottom: SPACING.M,
            marginTop: SPACING.XS
          }}
        >
          {items.map((item) => {
            return (
              <li key={item.to + item.text}>
                <SideNavLink path={to} item={item}>
                  {item.text}
                </SideNavLink>
              </li>
            );
          })}
        </ol>
      </nav>
    </LargeScreen>
  );
}

SideNavigation.propTypes = {
  branch: PropTypes.object,
  to: PropTypes.string
};

const SideNavLink = ({ path, item, children, ...rest }) => {
  const hasChildren = Boolean(item.children);
  const renderChildren = hasChildren && path.includes(item.to);
  const isActive = path === item.to;

  return (
    <React.Fragment>
      <Link
        kind='list'
        to={item.to}
        css={{
          ':hover': {
            textDecoration: 'underline'
          },
          alignItems: 'center',
          color: isActive ? COLORS.teal['400'] : 'inherit',
          display: 'flex',
          fontWeight: isActive ? '700' : 'inherit',
          justifyContent: 'space-between',
          paddingBottom: renderChildren ? SPACING.XS : SPACING.M,
          paddingRight: SPACING.S,
          paddingTop: SPACING.M
        }}
        {...rest}
      >
        {children}
        {hasChildren && (
          <span
            css={{
              color: COLORS.neutral['400'],
              lineHeight: '1',
              paddingLeft: SPACING.XS
            }}
          >
            <span className='visually-hidden'>(has sub-pages)</span>
            <Icon icon='expand_more' />
          </span>
        )}
      </Link>
      {renderChildren && (
        <ol
          css={{
            paddingBottom: SPACING.XS
          }}
        >
          {item.children.map((child, index) => {
            return (
              <li key={`child-${index}`}>
                <SideNavLink
                  key={path + child.text}
                  path={path}
                  item={child}
                  css={{
                    padding: `${SPACING.XS} 0`,
                    paddingLeft: SPACING.M
                  }}
                >
                  {child.text}
                </SideNavLink>
              </li>
            );
          })}
        </ol>
      )}
    </React.Fragment>
  );
};

SideNavLink.propTypes = {
  children: PropTypes.string,
  item: PropTypes.object,
  path: PropTypes.string
};
