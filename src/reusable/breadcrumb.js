import React from 'react'
import PropTypes from 'prop-types'
import { MEDIA_QUERIES, SPACING, Link, Icon } from '@reusable'

const Breadcrumb = ({ children, ...rest }) => {
  const numberOfBreadcrumbs = React.Children.count(children)
  const parentBreadcrumbIndex =
    numberOfBreadcrumbs > 1 ? numberOfBreadcrumbs - 2 : 0

  function isParent(i) {
    return parentBreadcrumbIndex === i
  }

  return (
    <nav
      aria-label="Breadcrumb"
      {...rest}
      css={{
        paddingTop: SPACING['M'],
        paddingBottom: SPACING['M'],
        [MEDIA_QUERIES.LARGESCREEN]: {
          paddingTop: SPACING['2XL'],
          paddingBottom: SPACING['XL'],
        },
      }}
    >
      <ol
        css={{
          [MEDIA_QUERIES.LARGESCREEN]: {
            '> li': {
              display: 'inline-block',
              marginRight: SPACING['2XS'],
            },
          },
        }}
      >
        {React.Children.map(children, (child, i) => (
          <li
            css={{
              display: isParent(i) ? 'block' : 'none',
              [MEDIA_QUERIES.LARGESCREEN]: {
                display: 'block',
              },
            }}
          >
            <span
              aria-hidden="true"
              css={{
                marginRight: SPACING['2XS'],
              }}
            >
              <Icon
                icon="navigate_next"
                css={{
                  display: 'none',
                  [MEDIA_QUERIES.LARGESCREEN]: {
                    display: i === 0 ? 'none' : 'inline-block',
                  },
                }}
              />
              <Icon
                icon="navigate_before"
                css={{
                  display: 'inline-block',
                  [MEDIA_QUERIES.LARGESCREEN]: {
                    display: 'none',
                  },
                }}
              />
            </span>
            {React.cloneElement(child, {
              isCurrent: i === numberOfBreadcrumbs - 1,
            })}
          </li>
        ))}
      </ol>
    </nav>
  )
}

Breadcrumb.propTypes = {
  /**
   * Pass in the BreadcrumbItem's for your Breadcrumb
   */
  children: PropTypes.node,
}

const BreadcrumbItem = ({ children, href, isCurrent, ...rest }) => {
  const currentProps = isCurrent
    ? {
        'aria-current': 'page',
      }
    : {}

  if (typeof children === 'string' && href) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    )
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, currentProps)
  }

  return children
}

BreadcrumbItem.propTypes = {
  /**
   * Pass in content that will be inside of the BreadcrumbItem
   */
  children: PropTypes.node,

  /**
   * Optional string representing the link location for the BreadcrumbItem
   */
  href: PropTypes.string,
}

export { Breadcrumb, BreadcrumbItem }
