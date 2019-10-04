import React from 'react'
import { StaticQuery, graphql, useStaticQuery, Link } from 'gatsby'
import {
  Heading,
  SPACING,
  COLORS,
  MEDIA_QUERIES,
  Icon
} from '@umich-lib/core'

export default function SideNavigation({
  title,
  to
}) {
  /*
    TODO:

    - [ ] Find where this page slug exists in the nav tree.
    - [ ] Use that node of the tree to render siblings and children
          of siblings and self.
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

  const primaryNavData = data.allNavPrimary.edges[0].node.nav
  const path = to
    .substring(1)
    .split('/')
    .map(p => "/" + p)
  const parentPath = path
    .slice(0, path.length - 1)

  const siblings = parentPath.reduce((acc, p, y) => {
    const fullPath = parentPath.slice(0, y+1).join('')
    const match = acc.find(i => i.to === fullPath)

    if (match) {
      return match.children
    }

    return acc
  }, primaryNavData)

  return (
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
        '> li:not(:last-of-type)': {
          borderBottom: `solid 1px ${COLORS.neutral['100']}`
        }
      }}>
        {siblings.map(sibling =>
          <li key={sibling.to + sibling.text}>
            <SideNavLink
              path={to}
              item={sibling}
            >
              {sibling.text}
            </SideNavLink>
          </li>
        )}
      </ol>
    </nav>
  )
}

function SideNavLink({ path, item, children, ...rest }) {
  const { to } = item
  const isActive = path === to
  const showChildren = isActive && item.children
  const activePaddingStyles = showChildren ? {
    paddingBottom: SPACING['XS']
  } : {}
  const activeStyles = isActive ? {
    fontWeight: '700',
    color: COLORS.teal['400'],
    ...activePaddingStyles
  } : {}
  const activeContainerStyles = isActive ? {
    paddingBottom: showChildren ? SPACING['XS'] : '0'
  } : {}

  return (
    <div css={{
      ...activeContainerStyles,
      'li a': {
        paddingLeft: SPACING['M'],
        paddingTop: SPACING['XS'],
        paddingBottom: SPACING['XS'],
      }
    }}>
      <Link
        kind="list"
        to={to}
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          paddingTop: SPACING['S'],
          paddingBottom: SPACING['S'],
          paddingRight: SPACING['XS'],
          ':hover': {
            textDecoration: 'underline'
          },
          ...activeStyles
        }}
      >
        <span data-link-text>{children}</span>
        {item.children && (<span css={{
          color: COLORS.neutral['400'],
          paddingLeft: SPACING['XS'],
          lineHeight: '1'
        }}><Icon icon="expand_more" /></span>)}
      </Link>
      {showChildren && (
        <ol>
          {item.children.map(child => (
            <li>
              <SideNavLink path={path} item={child}>{child.text}</SideNavLink>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

