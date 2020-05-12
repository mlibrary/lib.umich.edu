import React from 'react'
import PropTypes from 'prop-types'
import { Global } from '@emotion/core'
import { UniversalHeader, GlobalStyleSheet, COLORS } from '@umich-lib/core'
import Header from './header'
import Footer from './footer'
import DevelopmentAlert from './development-alert'
import SkipLinks from './skip-links'
import useNavigationData from '../hooks/use-navigation-data'
import LibraryAlerts from '../maybe-design-system/library-alerts'

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
          'h1.focus': {
            position: 'relative',
            '&:focus': {
              outline: '0',
              '&:before': {
                content: '""',
                position: 'absolute',
                height: '100%',
                left: '-0.3em',
                borderLeft: `solid 4px ${COLORS.teal['400']}`,
              },
            },
          },
          '[data-reach-dialog-overlay]': {
            zIndex: '999',
            background: 'hsla(0, 0%, 0%, 0.6)',
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
          <SkipLinks />
          <DevelopmentAlert />
          <UniversalHeader />
          <LibraryAlerts domain="lib.umich.edu" />
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
