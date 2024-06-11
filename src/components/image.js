import React from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import { SPACING } from '../reusable';

export default function Image ({ image, caption, alt = '' }) {
  return (
    <GatsbyImage
      image={image}
      css={{
        width: '100%',
        borderRadius: '4px',
        marginBottom: SPACING.S
      }}
      alt={alt}
    />
  );
}
