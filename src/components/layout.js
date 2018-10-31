import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { injectGlobal } from 'react-emotion'
import Header from '@umich-lib-ui/header'
import Alert from '@umich-lib-ui/alert'

injectGlobal`
  body,
  html {
    padding: 0;
    margin: 0;
    font-size: 16px;
    font-family: 'Source Sans Pro', sans-serif;
    line-height: 1.5;
  }

  @media screen and (min-width: 960px) {
    body,
    html {
      font-size: 19px;
    }
  }

  a {
    color: #126DC1;
  }

  * {
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  [data-inner-container] {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 1rem;
  }
`

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => {
      const {
        title
      } = data.site.siteMetadata

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
          <Header />
          <Alert intent="informational">This is a proof of concept Gatsby site to source data from Drupal.</Alert>
          <div data-inner-container>
            {children}
          </div>
        </React.Fragment>
      )
    }}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
