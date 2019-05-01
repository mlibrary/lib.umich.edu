import React from 'react'
import { Header } from '@umich-lib/core'
import { StaticQuery, Link } from 'gatsby'

export default () => (
  <StaticQuery
    query={graphql`
      query {
        allNavPrimary {
          edges {
            node {
              nav {
                to
                text
                description
                children {
                  text
                  to
                  description
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
    `}
    render={data => {
      const primary = data.allNavPrimary.edges[0].node.nav
      const secondary = data.allNavUtility.edges[0].node.nav

      return (
        <Header primary={primary} secondary={secondary} linkAs={Link} />
      )
    }}
  />
)