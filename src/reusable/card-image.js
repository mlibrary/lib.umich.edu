import React from 'react'
import BackgroundImage from 'gatsby-background-image'
import { COLORS, SPACING } from '@reusable'

export default function CardImage({ image }) {
  return (
    <BackgroundImage
      aria-hidden="true"
      data-card-image
      tag="div"
      fluid={image}
      css={{
        backgroundColor: COLORS.blue['100'],
        paddingTop: '66.67%',
        marginBottom: SPACING['S'],
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    />
  )
}
