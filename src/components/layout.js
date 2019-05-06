import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import Header from './header'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      {
        site {
          siteMetadata {
            title
          }
        }
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
                  description,
                  children {
                    text
                    to
                    description
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
    `}
    render={data => {
      const {
        title
      } = data.site.siteMetadata
      const primary = data.allNavPrimary.edges[0].node.nav
      const secondary = data.allNavUtility.edges[0].node.nav

      return (
        <React.Fragment>
          <Helmet
            title={title}
            link={[
              {
                rel: 'shortcut icon',
                type: 'image/png',
                href: 'https://raw.githubusercontent.com/mlibrary/umich-lib-ui/master/www/static/favicon.ico'
              }
            ]}
          >
            <html lang="en" />
          </Helmet>
          <Header
            primary={primary}
            secondary={secondary}
          />
          {children}
        </React.Fragment>
      )
    }}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
