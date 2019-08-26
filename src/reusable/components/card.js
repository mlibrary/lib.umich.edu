import React from 'react'
import PropTypes from 'prop-types';
import BackgroundImage from 'gatsby-background-image'
import {
  COLORS,
  SPACING,
  Z_SPACE,
  LINK_STYLES,
  TYPOGRAPHY
} from '@umich-lib/core'

export default function Card({
  title,
  subtitle,
  image,
  href,
  description,
  renderAnchor,
  children,
  ...rest
}) {
  const anchorStyles = {
    display: 'block',
    maxWidth: '600px',
    ':hover': {
      '[data-card-image]': {
        ...Z_SPACE[8],
      },
      '[data-card-title]': {
        ...LINK_STYLES['description'][':hover']
      }
    }
  }

  const anchorProps = {
    href,
    ...rest
  }

  function renderChildren() {
    if (!children) {
      return null
    }

    const styles = {
      color: COLORS.neutral[300],
      marginTop: SPACING['XS']
    }

    if (typeof children === 'string') {
      return (
        <p css={styles}>
          {children}
        </p>
      )
    }

    return (
      <div css={styles}>
        {children}
      </div>
    )
  }

  const content = (
    <React.Fragment>
      {image && (
        <BackgroundImage
          aria-hidden="true"
          data-card-image
          tag="div"
          fluid={image}
          css={{
            backgroundColor: COLORS.blue['100'],
            paddingTop: '66.67%',
            marginBottom: SPACING['S'],
            borderRadius: '2px',
            zIndex: '-1'
          }}
        />
      )}

      <p role="heading">
        {subtitle && (<span css={{
          display: 'block',
          color: COLORS.neutral[300],
          marginBottom: SPACING['2XS'],
          ...TYPOGRAPHY['3XS']
        }}>{subtitle}</span>)}
        <span
          css={{
            ...LINK_STYLES['description'],
          }}
          data-card-title
        >{title}</span>
      </p>

      {renderChildren()}
    </React.Fragment>
  )

  if (renderAnchor) {
    return renderAnchor({
      ...anchorProps,
      anchorStyles: anchorStyles,
      children: content
    })
  }

  return (
    <a
      {...anchorProps}
      css={anchorStyles}
      children={content}
    />
  )
}

Card.propTypes = {
  /*
  * Provide a Gatsby image object to image. This is purely decorative
  * and shouldn't be required to understand the Card.
  **/
  image: PropTypes.node.isRequired,

  /*
  * The title should briefly describe where the Card will take
  * the user when they click on it.
  **/
  title: PropTypes.string.isRequired,

  /*
  * Regular React element.
  **/
  children: PropTypes.node,

  /*
  * An optional addition to the Card heading. Only use if necessary.
  **/
  subtitle: PropTypes.string,

  /*
  * Provide a url for where this card should route to.
  **/
  href: PropTypes.string.isRequired,

  /*
  * An optional parameter to allow overriding the anchor rendering.
  * Useful for using Card along with react-router or other client
  * side router libraries.
  **/
  renderAnchor: PropTypes.func
};