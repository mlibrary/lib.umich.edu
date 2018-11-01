import React from 'react'
import styled from 'react-emotion'
import {
  MEDIA_QUERIES,
  colors
} from '@umich-lib-ui/styles'

import PlaceholderHeroImage from '../images/design_5210.jpg'

const StyledHeroContainer = styled('div')({
  minHeight: '20rem',
  [MEDIA_QUERIES.LARGESCREEN]: {
    height: '33vh'
  },
  overflow: 'hidden',
  backgroundImage: `url(${PlaceholderHeroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  position: 'relative'
})

const StyledHeroInnerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

const Hero = ({ image, children }) => (
  <StyledHeroContainer image={image}>
    <StyledHeroInnerContainer data-inner-container>
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        background: colors.blue[500],
        opacity: '0.1'
      }}>
      </div>
      {children}
    </StyledHeroInnerContainer>
  </StyledHeroContainer>
)

export default Hero