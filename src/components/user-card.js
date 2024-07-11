import React from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import { COLORS, SPACING, Text } from '../reusable';
import Link from './link';
import StaffPhotoPlaceholder from './staff-photo-placeholder';

const photoContainerCSS = {
  aspectRatio: '3 / 4',
  backgroundColor: COLORS.blue['100'],
  borderRadius: '2px',
  flexShrink: '0',
  overflow: 'hidden',
  width: '75px'
};

function UserPhoto ({ image }) {
  if (!image) {
    return (
      <div css={photoContainerCSS}>
        <StaffPhotoPlaceholder />
      </div>
    );
  }

  return (
    <GatsbyImage
      image={image.imageData}
      alt={image.alt}
      css={photoContainerCSS}
    />
  );
}

export default function UserCard ({ name, to, image, title, phone, email }) {
  return (
    <section
      css={{
        display: 'flex',
        margin: `${SPACING.L} 0`
      }}
    >
      <UserPhoto image={image} />
      <div
        css={{
          marginLeft: SPACING.M
        }}
      >
        <Link to={to} kind='description'>
          {name}
        </Link>
        <Text>{title}</Text>
        {phone && (
          <p>
            <Link to={`tel:${phone}`}>{phone}</Link>
          </p>
        )}
        {email && (
          <p>
            <Link to={`mailto:${email}`}>{email}</Link>
          </p>
        )}
      </div>
    </section>
  );
}
