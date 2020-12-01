import React from 'react'
import PageWrap from './src/components/page-wrap'

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
  return <PageWrap element={element} />
}

export const onRouteUpdate = ({ prevLocation }) => {
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
