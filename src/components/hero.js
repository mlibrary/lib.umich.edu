import { GatsbyImage } from 'gatsby-plugin-image';
import { MEDIA_QUERIES } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const StyledHeroContainer = styled('div')({
  minHeight: '20rem',
  position: 'relative',
  [MEDIA_QUERIES.S]: {
    height: '33vh'
  }
});

const StyledHeroInnerContainer = styled('div')({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center'
});

const StyledTint = styled('div')({
  background: 'var(--color-blue-400)',
  bottom: '0',
  left: '0',
  opacity: '0.1',
  position: 'absolute',
  right: '0',
  top: '0'
});

const Hero = ({ image, children }) => {
  return (
    <StyledHeroContainer>
      <GatsbyImage
        image={image}
        style={{
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%'
        }}
        alt=''
      />
      <StyledHeroInnerContainer data-inner-container>
        <StyledTint />
        {children}
      </StyledHeroInnerContainer>
    </StyledHeroContainer>
  );
};

Hero.propTypes = {
  children: PropTypes.array,
  image: PropTypes.string
};

export default Hero;
