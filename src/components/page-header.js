import {
  BREAKPOINTS,
  Heading,
  Margins,
  MEDIA_QUERIES,
  SPACING,
  Text
} from '../reusable';
import Breadcrumb from './breadcrumb';
import { GatsbyImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

export default function PageHeader ({ breadcrumb, title, summary, image, ...rest }) {
  const imageData = image
    ? image.relationships.field_media_image.localFile.childImageSharp.gatsbyImageData
    : null;

  const imageAlt = image?.field_media_image?.alt || '';
  return (
    <div
      css={{
        borderBottom: `solid 1px var(--color-neutral-100)`
      }}
    >
      <Margins>
        <header
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              alignItems: 'stretch',
              display: 'flex',
              minHeight: '350px'
            }
          }}
          {...rest}
        >
          <div
            css={{
              [MEDIA_QUERIES.LARGESCREEN]: {
                flex: '1 1 0'
              },
              paddingBottom: SPACING.L,
              paddingLeft: '0',
              paddingRight: SPACING['2XL'],
              paddingTop: '0'
            }}
          >
            <Breadcrumb data={breadcrumb} />
            <Heading
              size='3XL'
              level={1}
              css={{
                marginBottom: SPACING.M
              }}
            >
              {title}
            </Heading>
            {summary && <Text lede>{summary}</Text>}
          </div>
          {imageData && (
            <React.Fragment>
              <GatsbyImage
                image={imageData}
                css={{
                  flex: '0 1 50%',
                  margin: `0 -${SPACING.M}`,
                  [MEDIA_QUERIES.LARGESCREEN]: {
                    margin: 0,
                    maxHeight: '350px'
                  }
                }}
                alt={imageAlt}
              />
            </React.Fragment>
          )}
        </header>
      </Margins>
    </div>
  );
}

PageHeader.propTypes = {
  breadcrumb: PropTypes.string,
  image: PropTypes.object,
  imageAlt: PropTypes.string,
  summary: PropTypes.string,
  title: PropTypes.string
};
