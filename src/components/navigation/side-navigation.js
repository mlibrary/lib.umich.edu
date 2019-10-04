import React from 'react'
import { graphql, useStaticQuery, Link } from 'gatsby'
import {
  Heading,
  SPACING,
  COLORS,
  MEDIA_QUERIES,
  Icon
} from '@umich-lib/core'

function getSiteMapBranch({ data, to }) {
  const find = n => to.includes(n.to)
  const root = data.find(find)

  if (root) {
    const parent = root.children.find(find)

    if (parent) {
      return parent
    }
  }

  return null
}

export default function SideNavigation({ to }) {
  /*
    TODO
    - [ ] Consider how to move this logic to build step
          as a "local navigation" field.
  */
  const data = useStaticQuery(
    graphql`
      {
        allNavPrimary {
          edges {
            node {
              nav {
                to
                text
                children {
                  text
                  to
                  children {
                    text
                    to
                    children {
                      text
                      to
                    }
                  }
                }
              }
            }
          }
        }
        allNavUtility {
          edges {
            node {
              nav {
                to
                text
              }
            }
          }
        }
      }
    `
  )

  const branch = getSiteMapBranch({
    data: data.allNavPrimary.edges[0].node.nav,
    to
  })

  if (!branch) {
    return null
  }

  const title = branch.text
  const items = branch.children

  if (!items) {
    return null
  }

  return (
    <React.Fragment>
      <nav
        css={{
          display: 'none',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'block'
          }
        }}
        aria-labelledby="side-nav-heading"
      >
        <Heading size="S" level={2} id="side-nav-heading">{title}</Heading>
        <ol css={{
          marginTop: SPACING['XS'],
          marginBottom: SPACING['M'],
          '> li': {
            padding: `${SPACING['S']} 0`
          },
          '> li:not(:last-of-type)': {
            borderBottom: `solid 1px ${COLORS.neutral['100']}`
          }
        }}>
          {items.map(item =>
            <li key={item.to + item.text}>
              <SideNavLink
                path={to}
                item={item}
              >
                {item.text}
              </SideNavLink>
            </li>
          )}
        </ol>
      </nav>
    </React.Fragment>
  )
}

function SideNavLink({ path, item, children }) {
  const hasChildren = item.children ? true : false
  const renderChildren = hasChildren && path.includes(item.to)
  const isActive = path === item.to

  return (
    <React.Fragment>
      <Link
        kind="list"
        to={item.to}
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: SPACING['XS'],
          color: isActive ? COLORS.teal['400'] : 'inherit',
          fontWeight: isActive ? '700' : 'inherit',
          ':hover': {
            textDecoration: 'underline'
          }
        }}
      >
        {children}
        {hasChildren && (
          <span css={{ lineHeight: '1', color: COLORS.neutral['400'] }}>
            <Icon icon="expand_more" />
          </span>
        )}
      </Link>
      {renderChildren && (
        <ol css={{
          paddingTop: SPACING['XS'],
        }}>
          {item.children.map(child => (
            <li css={{
              padding: `${SPACING['XS']} 0`,
              paddingLeft: SPACING['M'],
            }}>
              <SideNavLink path={path} item={child}>{child.text}</SideNavLink>
            </li>
          ))}
        </ol>
      )}
    </React.Fragment>
  )
}
