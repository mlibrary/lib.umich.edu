import React from 'react'
import HeaderLargeScreen from './header-largescreen'
import HeaderSmallScreen from './header-smallscreen'

function Header({ primary, secondary }) {
  return (
    <React.Fragment>
      <div
        css={{
          display: 'block',
          '@media only screen and (min-width: 1129px)': {
            display: 'none',
          },
        }}
      >
        <HeaderSmallScreen primary={primary} secondary={secondary} />
      </div>
      <div
        css={{
          display: 'block',
          '@media only screen and (max-width: 1128px)': {
            display: 'none',
          },
        }}
      >
        <HeaderLargeScreen primary={primary} secondary={secondary} />
      </div>
    </React.Fragment>
  )
}

export default Header
