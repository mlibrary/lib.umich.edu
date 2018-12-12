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
  const topLevelNavData = data.allNodeLandingPage.edges[0].node.relationships.node__page
  const navData = topLevelNavData.reduce((acc, page) => {
    if (page.relationships.node__page) {
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
      fragment PageFields on node__page {
        title
        path {
          alias
        }
      }
      {
        allNodeLandingPage {
          edges {
            node {
              title
              path {
                alias
              }
              relationships {
                node__page {
                  ...PageFields
                  relationships {
                    node__page {
                      ...PageFields
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