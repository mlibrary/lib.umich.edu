import {
  COLORS,
  Heading,
  LINK_STYLES,
  MEDIA_QUERIES,
  SPACING,
  TYPOGRAPHY,
  Z_SPACE
} from '../reusable';
import CardImage from './card-image';
import PropTypes from 'prop-types';
import React from 'react';

export default function Card ({
  title,
  subtitle,
  headingLevel = '3',
  image,
  href,
  renderAnchor,
  children,
  horizontal,
  ...rest
}) {
  const horizontalStyles = horizontal
    ? {
        [MEDIA_QUERIES.LARGESCREEN]: {
          '[data-card-image]': {
            marginBottom: '0'
          },
          display: 'grid',
          gridGap: SPACING.M,
          gridTemplateColumns: `18.75rem 1fr `
        }
      }
    : {};

  const anchorStyles = {
    display: 'block',
    ...horizontalStyles,
    ':hover': {
      '[data-card-image]': {
        ...Z_SPACE[8]
      },
      '[data-card-title]': {
        ...LINK_STYLES.description[':hover']
      }
    }
  };

  const anchorProps = {
    href,
    ...rest
  };

  const renderChildren = () => {
    if (!children) {
      return null;
    }

    const styles = {
      color: COLORS.neutral[300],
      marginTop: SPACING.XS
    };

    if (typeof children === 'string') {
      return <p css={styles}>{children}</p>;
    }

    return <div css={styles}>{children}</div>;
  };

  const content = (
    <React.Fragment>
      {image && <CardImage image={image} />}

      <div>
        <Heading level={headingLevel} style={{ marginTop: '0' }}>
          {subtitle && (
            <span
              css={{
                color: COLORS.neutral[300],
                display: 'block',
                marginBottom: SPACING['2XS'],
                ...TYPOGRAPHY['3XS']
              }}
            >
              {subtitle}
            </span>
          )}
          <span
            css={{
              ...LINK_STYLES.description
            }}
            data-card-title
          >
            {title}
          </span>
        </Heading>

        {renderChildren()}
      </div>
    </React.Fragment>
  );

  if (renderAnchor) {
    return renderAnchor({
      ...anchorProps,
      anchorStyles,
      children: content
    });
  }

  return <a {...anchorProps} css={anchorStyles}>{content}</a>;
}

Card.propTypes = {

  /*
  * Regular React element.
  *
  */
  children: PropTypes.node,

  /*
   * Determine the heading level to render to ensure proper hierarchy on each page.
   *
   */
  headingLevel: PropTypes.oneOf(['h3', 'h2']),

  /*
   * Let the Card know if it can go horizontal on large screens.
   *
   */
  horizontal: PropTypes.bool,

  /*
   * Provide a url for where this card should route to.
   *
   */
  href: PropTypes.string,

  /*
   * Provide a Gatsby image object to image. This is purely decorative
   * and shouldn't be required to understand the Card.
   *
   */
  image: PropTypes.object,

  /*
   * An optional parameter to allow overriding the anchor rendering.
   * Useful for using Card along with react-router or other client
   * side router libraries.
   *
   */
  renderAnchor: PropTypes.func,

  /*
   * An optional addition to the Card heading. Only use if necessary.
   *
   */
  subtitle: PropTypes.string,

  /*
   * The title should briefly describe where the Card will take
   * the user when they click on it.
   *
   */
  title: PropTypes.string.isRequired

};
