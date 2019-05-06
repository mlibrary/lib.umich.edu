import React from 'react'
import HeaderLargeScreen from './header-largescreen'
import HeaderSmallScreen from './header-smallscreen'

function Header({
  primary,
  secondary
}) {

  return (
    <React.Fragment>
      <div
        css={{
          [`@media only screen and (max-width: 1200px)`]: {
            display: 'none'
          }
        }}
      >
        <HeaderLargeScreen
          primary={primary}
          secondary={secondary}
        />
      </div>
      <div
        css={{
          [`@media only screen and (min-width: 1201px)`]: {
            display: 'none'
          }
        }}
      >
        <HeaderSmallScreen
          primary={primary}
          secondary={secondary}
        />
      </div>
    </React.Fragment>
  )
}

export default Header