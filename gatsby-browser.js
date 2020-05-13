import React from 'react'

import { UniversalHeader } from '@umich-lib/core'
import SkipLinks from './src/components/skip-links'
import LibraryAlerts from './src/maybe-design-system/library-alerts'

export const onClientEntry = () => {
  const {
    applyPolyfills,
    defineCustomElements,
  } = require('@umich-lib/components/loader')

  applyPolyfills().then(() => {
    defineCustomElements(window)
  })
}

export const wrapPageElement = ({ element }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <React.Fragment>
      <div
        css={{
          minHeight: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          gridTemplateColumns: '100%',
        }}
      >
        <div>
          <SkipLinks />
          <UniversalHeader />
          <LibraryAlerts domain="lib.umich.edu" />
        </div>
        {element}
      </div>
      <m-chat></m-chat>
    </React.Fragment>
  )
}

export const onRouteUpdate = ({ location, prevLocation }) => {
  const oldPath = prevLocation ? prevLocation.pathname : null

  if (oldPath) {
    const dataPageHeading = document.querySelector('[data-page-heading]')
    const h1 = document.querySelector('h1')
    const pageHeading = dataPageHeading ? dataPageHeading : h1

    if (pageHeading) {
      pageHeading.setAttribute('tabindex', '-1')
      pageHeading.classList.add('focus')
      pageHeading.focus()
    }
  }
}

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  if (location?.state?.preserveScroll) {
    return false
  }

  return true
}
