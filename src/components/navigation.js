import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { Heading } from '@reusable'

const getPages = data => {
  return data.map(page => {
    const pages = page.relationships && page.relationships.node__page

    return {
      text: page.title,
      to: page.path.alias,
      pages: pages ? getPages(pages) : null,
    }
  })
}

const StyledNav = styled('nav')({
  marginTop: '1rem',
})

const StyledNavList = styled('nav')({
  listStyle: 'none',
  padding: '0',
  margin: '0',
})

const StyledLink = styled(Link)({
  display: 'block',
  padding: '0.15rem 0',
  ':hover': {
    textDecoration: 'underline',
  },
})

const Navigation = ({ data }) => {
  if (!data) {
    return null
  }
  const navData = getPages(data)

  return (
    <StyledNav>
      <Heading
        level={2}
        size="medium"
        style={{
          marginTop: 0,
        }}
      >
        In this section
      </Heading>
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
