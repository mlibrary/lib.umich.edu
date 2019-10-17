import React from 'react'
import PropTypes from 'prop-types'
import { Global } from '@emotion/core'
import { StaticQuery, graphql } from 'gatsby'

import {
  UniversalHeader,
  GlobalStyleSheet,
  COLORS,
  Alert,
  Margins,
} from '@umich-lib/core'

import Header from './header'
import Footer from './footer'
import DevelopmentAlert from './development-alert'
import AccessibilityModeAlert from './accessibility-mode-alert'

const a11yMode = process.env.ACCESSIBILITY_MODE === 'true'

if (a11yMode) {
  let date = new Date()
  let dayOfWeek = date.getDay()

  if (dayOfWeek === 4) {
    import('no-mouse-days')
  }
}

const Layout = ({ children, drupalNid }) => (
  <StaticQuery
    query={graphql`
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
      const primary = data.allNavPrimary.edges[0].node.nav
      const secondary = data.allNavUtility.edges[0].node.nav

      return (
        <React.Fragment>
          <GlobalStyleSheet />
          <Global
            styles={{
              'html, body, #___gatsby, #___gatsby > div': {
                height: '100%',
              },
              '*:focus': {
                outlineColor: COLORS.blue['400'],
              },
            }}
          />
          <div
            css={{
              minHeight: '100%',
              display: 'grid',
              gridTemplateRows: 'auto 1fr auto',
              gridTemplateColumns: '100%',
            }}
          >
            <div>
              {a11yMode && <AccessibilityModeAlert />}
              <DevelopmentAlert />
              <UniversalHeader />
              <Header primary={primary} secondary={secondary} />
            </div>
            <main>{children}</main>
            <Footer />
          </div>
          {drupalNid && (
            <div
              css={{ display: 'none' }}
              id="drupalNid"
              data-drupal-nid={drupalNid}
            />
          )}
        </React.Fragment>
      )
    }}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
