import React from 'react';
import { BgImage } from 'gbimage-bridge';
import { COLORS, SPACING } from '@reusable';

export default function CardImage({ image }) {
  return (
    <BgImage
      aria-hidden="true"
      data-card-image
      tag="div"
      image={image}
      css={{
        backgroundColor: COLORS.blue['100'],
        paddingTop: '66.67%',
        marginBottom: SPACING['S'],
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    />
  );
}
