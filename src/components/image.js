import { GatsbyImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';
import { SPACING } from '../reusable';

export default function Image ({ image, alt = '' }) {
  return (
    <GatsbyImage
      image={image}
      css={{
        borderRadius: '4px',
        marginBottom: SPACING.S,
        width: '100%'
      }}
      alt={alt}
    />
  );
}
Image.propTypes = {
  alt: PropTypes.string,
  image: PropTypes.string
};
