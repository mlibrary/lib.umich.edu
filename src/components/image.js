import React from 'react';
import Img from 'gatsby-image';

import { SPACING } from '@reusable';

export default function Image({ image, caption, alt = '' }) {
  return (
    <Img
      css={{
        width: '100%',
        borderRadius: '4px',
        marginBottom: SPACING['S'],
      }}
      fluid={image}
      alt={alt}
    />
  );
}
