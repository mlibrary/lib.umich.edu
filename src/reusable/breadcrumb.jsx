import { Icon, Link, MEDIA_QUERIES, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

const Breadcrumb = ({ children, ...rest }) => {
  const numberOfBreadcrumbs = React.Children.count(children);
  const parentBreadcrumbIndex
    = numberOfBreadcrumbs > 1 ? numberOfBreadcrumbs - 2 : 0;

  const isParent = (index) => {
    return parentBreadcrumbIndex === index;
  };

  return (
    <nav
      aria-label='Breadcrumb'
      {...rest}
      css={{
        paddingBottom: SPACING.M,
        paddingTop: SPACING.M,
        [MEDIA_QUERIES.S]: {
          paddingBottom: SPACING.XL,
          paddingTop: SPACING['2XL']
        }
      }}
    >
      <ol
        css={{
          [MEDIA_QUERIES.S]: {
            '> li': {
              display: 'inline-block',
              marginRight: SPACING['2XS']
            }
          }
        }}
      >
        {React.Children.map(children, (child, index) => {
          return (
            <li
              key={`breadcrumb-${index}`}
              css={{
                display: isParent(index) ? 'block' : 'none',
                [MEDIA_QUERIES.S]: {
                  display: 'block'
                }
              }}
            >
              <span
                aria-hidden='true'
                css={{
                  marginRight: SPACING['2XS']
                }}
              >
                <Icon
                  icon='navigate_next'
                  css={{
                    display: 'none',
                    [MEDIA_QUERIES.S]: {
                      display: index === 0 ? 'none' : 'inline-block'
                    }
                  }}
                />
                <Icon
                  icon='navigate_before'
                  css={{
                    display: 'inline-block',
                    [MEDIA_QUERIES.S]: {
                      display: 'none'
                    }
                  }}
                />
              </span>
              {React.cloneElement(child, {
                isCurrent: index === numberOfBreadcrumbs - 1
              })}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  /**
   * Pass in the BreadcrumbItem's for your Breadcrumb
   */
  children: PropTypes.node
};

const BreadcrumbItem = ({ children, href, isCurrent, ...rest }) => {
  const currentProps = isCurrent
    ? {
        'aria-current': 'page'
      }
    : {};

  if (typeof children === 'string' && href) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, currentProps);
  }

  return children;
};

BreadcrumbItem.propTypes = {
  /**
   * Pass in content that will be inside of the BreadcrumbItem
   */
  children: PropTypes.node,
  /**
   * Optional string representing the link location for the BreadcrumbItem
   */
  href: PropTypes.string,
  isCurrent: PropTypes.bool
};

export { Breadcrumb, BreadcrumbItem };
