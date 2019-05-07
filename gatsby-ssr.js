/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from 'react'
import { Chat, UniversalHeader, GlobalStyleSheet } from "@umich-lib/core"

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <React.Fragment>
      <GlobalStyleSheet />
      <UniversalHeader />
        {element}
      <Chat fixed />
    </React.Fragment>
  )
}