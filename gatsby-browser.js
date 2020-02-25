import React from 'react'

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
      {element}
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
