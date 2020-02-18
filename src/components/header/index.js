import React from 'react'
import { useMediaQuery } from 'react-responsive'
import HeaderLargeScreen from './header-largescreen'
import HeaderSmallScreen from './header-smallscreen'

function Header({ primary, secondary }) {
  const isLargeScreen = useMediaQuery({
    query: '(min-width: 1130px)',
  })

  if (isLargeScreen) {
    return <HeaderLargeScreen primary={primary} secondary={secondary} />
  }

  return <HeaderSmallScreen primary={primary} secondary={secondary} />
}

export default Header
