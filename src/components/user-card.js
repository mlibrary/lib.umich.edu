import React from 'react';
import { BgImage } from 'gbimage-bridge';
import { Text, SPACING, COLORS } from '@reusable';
import Link from './link';
import StaffPhotoPlaceholder from './staff-photo-placeholder';

const photoContainerCSS = {
  width: '75px',
  height: '101px',
  backgroundColor: COLORS.blue['100'],
  borderRadius: '2px',
  overflow: 'hidden',
  flexShrink: '0',
};

function UserPhoto({ image }) {
  if (!image) {
    return (
      <div css={photoContainerCSS}>
        <StaffPhotoPlaceholder />
      </div>
    );
  }

  return (
    <BgImage
      aria-hidden="true"
      data-card-image
      tag="div"
      image={image.imageData}
      alt={image.alt}
      css={photoContainerCSS}
    />
  );
}

export default function UserCard({ name, to, image, title, phone, email }) {
  return (
    <section
      css={{
        display: 'flex',
        margin: `${SPACING['L']} 0`,
      }}
    >
      <UserPhoto image={image} />
      <div
        css={{
          marginLeft: SPACING['M'],
        }}
      >
        <Link to={to} kind="description">
          {name}
        </Link>
        <Text>{title}</Text>
        {phone && (
          <p>
            <Link to={'tel:' + phone}>{phone}</Link>
          </p>
        )}
        {email && (
          <p>
            <Link to={'mailto:' + email}>{email}</Link>
          </p>
        )}
      </div>
    </section>
  );
}
