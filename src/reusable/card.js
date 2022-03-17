import React from 'react';
import PropTypes from 'prop-types';
import {
  COLORS,
  SPACING,
  Z_SPACE,
  LINK_STYLES,
  TYPOGRAPHY,
  MEDIA_QUERIES,
} from '@reusable';
import CardImage from './card-image';

export default function Card({
  title,
  subtitle,
  image,
  href,
  description,
  renderAnchor,
  children,
  horizontal,
  ...rest
}) {
  const horizontalStyles = horizontal
    ? {
        [MEDIA_QUERIES.LARGESCREEN]: {
          display: 'grid',
          gridTemplateColumns: `18.75rem 1fr `,
          gridGap: SPACING['M'],
          '[data-card-image]': {
            marginBottom: '0',
          },
        },
      }
    : {};

  const anchorStyles = {
    display: 'block',
    ...horizontalStyles,
    ':hover': {
      '[data-card-image]': {
        ...Z_SPACE[8],
      },
      '[data-card-title]': {
        ...LINK_STYLES['description'][':hover'],
      },
    },
  };

  const anchorProps = {
    href,
    ...rest,
  };

  function renderChildren() {
    if (!children) {
      return null;
    }

    const styles = {
      color: COLORS.neutral[300],
      marginTop: SPACING['XS'],
    };

    if (typeof children === 'string') {
      return <p css={styles}>{children}</p>;
    }

    return <div css={styles}>{children}</div>;
  }

  const content = (
    <React.Fragment>
      {image && <CardImage image={image} />}

      <div>
        <p role="heading" aria-level="3">
          {subtitle && (
            <span
              css={{
                display: 'block',
                color: COLORS.neutral[300],
                marginBottom: SPACING['2XS'],
                ...TYPOGRAPHY['3XS'],
              }}
            >
              {subtitle}
            </span>
          )}
          <span
            css={{
              ...LINK_STYLES['description'],
            }}
            data-card-title
          >
            {title}
          </span>
        </p>

        {renderChildren()}
      </div>
    </React.Fragment>
  );

  if (renderAnchor) {
    return renderAnchor({
      ...anchorProps,
      anchorStyles: anchorStyles,
      children: content,
    });
  }

  return <a {...anchorProps} css={anchorStyles} children={content} />;
}

Card.propTypes = {
  /*
   * Provide a Gatsby image object to image. This is purely decorative
   * and shouldn't be required to understand the Card.
   **/
  image: PropTypes.object,

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
  href: PropTypes.string,

  /*
   * Let the Card know if it can go horizontal on large screens.
   **/
  horizontal: PropTypes.bool,

  /*
   * An optional parameter to allow overriding the anchor rendering.
   * Useful for using Card along with react-router or other client
   * side router libraries.
   **/
  renderAnchor: PropTypes.func,
};
