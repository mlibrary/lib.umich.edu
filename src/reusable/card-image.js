import React from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import { COLORS, SPACING } from '../reusable';

export default function CardImage({ image }) {
  return (
    <GatsbyImage
      image={image}
      alt={image.alt || ''}
      css={{
        aspectRatio: '3 / 2',
        backgroundColor: COLORS.blue['100'],
        borderRadius: '4px',
        marginBottom: SPACING['S'],
        overflow: 'hidden',
        width: '100%'
      }}
    />
  );
}
