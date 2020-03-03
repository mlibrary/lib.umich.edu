import React from 'react'
import BackgroundImage from 'gatsby-background-image'
import { Text, SPACING, COLORS } from '@umich-lib/core'
import Link from './link'
import StaffPhotoPlaceholder from './staff-photo-placeholder'

function UserPhoto({ image }) {
  console.log('image', image)

  if (!image) {
    return <StaffPhotoPlaceholder />
  }

  return (
    <BackgroundImage
      aria-hidden="true"
      data-card-image
      tag="div"
      fluid={image.fluid}
      alt={image.alt}
      css={{
        width: '75px',
        height: '101px',
        backgroundColor: COLORS.blue['100'],
        borderRadius: '2px',
        overflow: 'hidden',
        flexShrink: '0',
      }}
    />
  )
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
            <Link to={phone}>{phone}</Link>
          </p>
        )}
        {email && (
          <p>
            <Link to={email}>{email}</Link>
          </p>
        )}
      </div>
    </section>
  )
}
