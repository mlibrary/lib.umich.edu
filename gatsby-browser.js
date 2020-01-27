/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using itimport React from "react"
import React from 'react'
import { Chat, LargeScreen, COLORS } from '@umich-lib/core'

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <React.Fragment>
      {element}
      <LargeScreen>
        <span
          id="ask-a-librarian-chat"
          css={{
            button: {
              outlineColor: COLORS.maize['400'],
            },
          }}
        >
          <Chat fixed />
        </span>
      </LargeScreen>
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
