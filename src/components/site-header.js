import React from 'react'
import Header from '@umich-lib-ui/header'
import { StaticQuery, Link } from 'gatsby'
import styled from 'react-emotion'

const StyledLink = styled(Link)({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline'
  }
})

const getTopLevelNav = (data) => {
  const topLevelNavData = data.allLandingPages.edges[0].node.relationships.pages
  const navData = topLevelNavData.reduce((acc, page) => {
    if (page.relationships.pages) {
      return acc.concat({
        text: page.title,
        to: page.path.alias
      })
    }

    return acc
  }, [])

  return navData
}

export default () => (
  <StaticQuery
    query={graphql`
      fragment PageFields on pages {
        title
        path {
          alias
        }
      }
      {
        allLandingPages {
          edges {
            node {
              title
              path {
                alias
              }
              relationships {
                pages {
                  ...PageFields
                  relationships {
                    pages {
                      ...PageFields
                      relationships {
                        pages {
                          ...PageFields
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => (
      <Header
        nav={getTopLevelNav(data)}
        renderAnchor={data => (
          <StyledLink
            to={data.to}
          >{data.text}</StyledLink>
        )}
      />
    )}
  />
)