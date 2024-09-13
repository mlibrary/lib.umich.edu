import { GatsbyImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';
import { SPACING } from '../reusable';

export default function CardImage ({ image }) {
  return (
    <GatsbyImage
      image={image}
      alt={image.alt || ''}
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
  image: PropTypes.shape({
    alt: PropTypes.string
  })
};
