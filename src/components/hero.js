import React from 'react';
import styled from '@emotion/styled';
import { MEDIA_QUERIES, COLORS } from '@reusable';
import { GatsbyImage } from 'gatsby-plugin-image';

const StyledHeroContainer = styled('div')({
  position: 'relative',
  minHeight: '20rem',
  [MEDIA_QUERIES.LARGESCREEN]: {
    height: '33vh',
  },
});

const StyledHeroInnerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

const StyledTint = styled('div')({
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  background: COLORS.blue[400],
  opacity: '0.1',
});

const Hero = ({ image, children }) => (
  <StyledHeroContainer>
    <GatsbyImage
      image={image}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
      alt=""
    />
    <StyledHeroInnerContainer data-inner-container>
      <StyledTint />
      {children}
    </StyledHeroInnerContainer>
  </StyledHeroContainer>
);

export default Hero;
