import React from 'react'
import { Link } from 'gatsby'
import styled from 'react-emotion'
import { colors } from '@umich-lib-ui/styles'

const getPages = (data) => {
  return data.map((page) => {
    const pages = page.relationships && page.relationships.pages

    return {
      text: page.title,
      to: page.path.alias,
      pages: pages ? getPages(pages) : null
    }
  })
}

const StyledNav = styled('nav')({
  background: colors.grey[200],
  padding: '0.75rem 1rem',
  marginTop: '1rem'
})

const StyledNavList = styled('nav')({
  listStyle: 'none',
  padding: '0',
  margin: '0'
})

const StyledLink = styled(Link)({
  display: 'block',
  textDecoration: 'none',
  padding: '0.25rem 0',
  ':hover': {
    textDecoration: 'underline'
  }
})

const Navigation = ({ data }) => {
  if (!data) {
    return null
  }
  const navData = getPages(data)
  
  return (
    <StyledNav>
      <StyledNavList>
        {navData.map(item => (
          <li>
            <StyledLink to={item.to}>{item.text}</StyledLink>
          </li>
        ))}
      </StyledNavList>
    </StyledNav>
  )
}

export default Navigation