import React from 'react'
import { Link } from 'gatsby'
import BackgroundImage from 'gatsby-background-image'
import {
  COLORS,
  SPACING,
  LINK_STYLES
} from '@umich-lib/core'

export default function Card({
  title,
  subtitle,
  image,
  to,
  description
}) {
  if (!image) {
    return (
      <React.Fragment>
        <Link to={to} css={{
          ...LINK_STYLES['list-strong']
        }}>
          <h3 css={{
          display: 'inline',
          ...LINK_STYLES['list-strong']
          }}>{title}</h3>
        </Link>
        {description && (<p css={{
          marginTop: SPACING['XS'],
          color: COLORS.neutral['300']
        }}>{description}</p>)}
      </React.Fragment>
    )
  }


  return (
    <Link to={to} css={{
      'display': 'block',
      ':hover h3': {
        ...LINK_STYLES['list-strong'][':hover']
      }
    }}>
      {image && (<BackgroundImage
        tag="div"
        fluid={image}
        css={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: '55%',
          marginBottom: SPACING['S'],
          borderRadius: '2px'
        }}
      />)}
      {subtitle && (<p>{subtitle}</p>)}
      <h3 css={{
        display: 'inline',
        ...LINK_STYLES['list-strong']
      }}>{title}</h3>
      {description && (<p css={{
        marginTop: SPACING['XS'],
        color: COLORS.neutral['300']
      }}>{description}</p>)}
    </Link>
  )
}