import React from 'react'
import Header from '@umich-lib/header'
import { StaticQuery, Link } from 'gatsby'
import styled from 'react-emotion'

const StyledLink = styled(Link)({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline'
  }
})

export default () => (
  <StaticQuery
    query={graphql`
      {
        navigation(id: { eq: "navigation" } ) {
          data {
            text
            to
            children {
              text
              to
            }
          }
        }
      }
    `}
    render={data => (
      <Header
        nav={data.navigation.data.children}
        renderAnchor={data => (
          <StyledLink
            to={data.to}
          >{data.text}</StyledLink>
        )}
      />
    )}
  />
)