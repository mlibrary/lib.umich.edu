import React from 'react'
import styled from 'react-emotion'
import {
  MEDIA_QUERIES,
  colors
} from '@umich-lib-ui/styles'
import {
  StaticQuery,
  graphql
} from 'gatsby'
import Image from 'gatsby-image'

const StyledHeroContainer = styled('div')({
  position: 'relative',
  minHeight: '20rem',
  [MEDIA_QUERIES.LARGESCREEN]: {
    height: '33vh'
  }
})

const StyledHeroInnerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

const StyledTint = styled('div')({
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  background: colors.blue[500],
  opacity: '0.1'
})

const Hero = ({ image, children }) => (
  <StaticQuery
    query={graphql`
      query {
        file(relativePath: { eq: "hero_1.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 1920) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => (
      <StyledHeroContainer>
        <Image
          fluid={data.file.childImageSharp.fluid}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
          }}
        />
        <StyledHeroInnerContainer data-inner-container>
          <StyledTint />
          {children}
        </StyledHeroInnerContainer>
      </StyledHeroContainer>
    )}
  />
 
)

export default Hero