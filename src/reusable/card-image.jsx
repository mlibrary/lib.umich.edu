import { GatsbyImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';
import { SPACING } from '../reusable';

export default function CardImage ({ image, alt = '' }) {
  return (
    <GatsbyImage
      image={image}
      alt={alt}
      css={{
        aspectRatio: '3 / 2',
        backgroundColor: 'var(--color-blue-100)',
        borderRadius: '4px',
        marginBottom: SPACING.S,
        overflow: 'hidden',
        width: '100%'
      }}
    />
  );
}

CardImage.propTypes = {
  alt: PropTypes.string,
  image: PropTypes.object
};
