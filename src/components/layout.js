import React from 'react'
import PropTypes from 'prop-types'
import { Global } from '@emotion/core'
import {
  UniversalHeader,
  GlobalStyleSheet,
  COLORS,
} from '@umich-lib/core'
import Header from './header'
import Footer from './footer'
import SkipLinks from './skip-links'
import useNavigationData from '../hooks/use-navigation-data'
import DevelopmentMessage from './development-message'

function Layout({ children, drupalNid }) {
  const { primary, secondary } = useNavigationData()

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
        <section>
          <DevelopmentMessage />
          <SkipLinks />
          <UniversalHeader />
          <Header primary={primary} secondary={secondary} />
        </section>
        <main id="maincontent">{children}</main>
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
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
