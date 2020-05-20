import React from 'react'
import { useWindowSize } from '@reach/window-size'

import HeaderLargeScreen from './header-largescreen'
import HeaderSmallScreen from './header-smallscreen'

function Header({ primary, secondary }) {
  const { width } = useWindowSize()

  if (width > 1129) {
    return <HeaderLargeScreen primary={primary} secondary={secondary} />
  }

  return <HeaderSmallScreen primary={primary} secondary={secondary} />
}

export default Header
