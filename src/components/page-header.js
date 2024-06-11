import React from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import {
  COLORS,
  Heading,
  Margins,
  MEDIA_QUERIES,
  SPACING,
  Text
} from '../reusable';

import Breadcrumb from './breadcrumb';

export default function PageHeader ({
  breadcrumb,
  title,
  summary,
  image,
  ...rest
}) {
  const imageData = image
    ? image.localFile.childImageSharp.gatsbyImageData
    : null;

  return (
    <div
      css={{
        borderBottom: `solid 1px ${COLORS.neutral['100']}`
      }}
    >
      <Margins>
        <header
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              display: 'flex',
              alignItems: 'stretch',
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
              paddingTop: '0',
              paddingRight: SPACING['2XL'],
              paddingLeft: '0'
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
              <div
                css={{
                  backgroundImage: `url('${imageData.images.fallback.src}')`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  display: 'none',
                  [MEDIA_QUERIES.LARGESCREEN]: {
                    display: 'block'
                  },
                  flex: '0 1 50%'
                }}
              />
              <GatsbyImage
                image={imageData}
                css={{
                  margin: `0 -${SPACING.M}`,
                  [MEDIA_QUERIES.LARGESCREEN]: {
                    display: 'none'
                  }
                }}
                alt=''
              />
            </React.Fragment>
          )}
        </header>
      </Margins>
    </div>
  );
}
