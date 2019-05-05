import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {
  UniversalHeader,
  GlobalStyleSheet
} from '@umich-lib/core'
import { StaticQuery, graphql } from 'gatsby'
import SiteHeader from './site-header'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      {
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
          <GlobalStyleSheet />
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
          <UniversalHeader />
          <SiteHeader />
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
