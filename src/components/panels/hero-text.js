import { Heading, Margins, MEDIA_QUERIES, SPACING } from '../../reusable';
import Html from '../html';
import Link from '../link';
import PropTypes from 'prop-types';
import React from 'react';
import usePageContextByDrupalNodeID from '../../hooks/use-page-context-by-drupal-node-id';

/* eslint-disable id-length, sort-keys */
const MEDIAQUERIES = {
  XL: '@media only screen and (min-width: 1200px)',
  L: '@media only screen and (min-width:920px)',
  M: '@media only screen and (min-width: 720px)',
  S: MEDIA_QUERIES.LARGESCREEN
};
/* eslint-enable id-length, sort-keys */

const getNIDFromURI = ({ uri }) => {
  if (uri.includes('entity:node/')) {
    return uri.split('/')[1];
  }

  return null;
};

const getLinkByNID = ({ nids, nid }) => {
  const obj = nids[nid];

  if (!obj) {
    return null;
  }

  return {
    text: obj.title,
    to: obj.slug
  };
};

export default function HeroText ({ data }) {
  /*
   *Consider finding a better way to do this.
   */
  const nids = usePageContextByDrupalNodeID();
  const nid = getNIDFromURI({ uri: data.field_link && data.field_link[0].uri });
  const link = getLinkByNID({ nid, nids });

  return (
    <Margins
      css={{
        padding: '0',
        [MEDIA_QUERIES.LARGESCREEN]: {
          padding: '0'
        },
        [MEDIAQUERIES.M]: {
          padding: '0'
        },
        [MEDIAQUERIES.L]: {
          padding: `0 ${SPACING['2XL']}`
        }
      }}
    >
      <BackgroundSection data={data}>
        <div
          css={{
            display: 'flex',
            justifyContent: 'center',
            padding: `${SPACING['2XL']} ${SPACING.M}`,
            [MEDIA_QUERIES.LARGESCREEN]: {
              padding: `${SPACING['4XL']} ${SPACING.S}`
            }
          }}
        >
          <div
            css={{
              // eslint-disable-next-line id-length
              a: {
                ':hover': {
                  boxShadow: 'none',
                  textDecorationThickness: '2px'
                },
                boxShadow: 'none',
                color: 'white',
                textDecoration: 'underline'
              },
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Heading
              size='3XL'
              level={2}
              css={{
                marginBottom: SPACING.M
              }}
            >
              {data.field_title}
            </Heading>
            <Html
              html={data.field_caption_text.processed}
              css={{
                display: 'inline-block',
                fontSize: '1.25rem',
                width: 'auto'
              }}
            />
            {link && (
              <div
                css={{
                  // eslint-disable-next-line id-length
                  a: {
                    ':focus, :hover': {
                      textDecorationThickness: '4px'
                    },
                    textDecorationColor: 'var(--color-maize-400)',
                    textDecorationThickness: '2px'
                  },
                  fontSize: '1.25rem',
                  marginTop: SPACING.M
                }}
              >
                <Link to={link.to}>{link.text}</Link>
              </div>
            )}
          </div>
        </div>
      </BackgroundSection>
    </Margins>
  );
}

HeroText.propTypes = {
  data: PropTypes.object
};

const BackgroundSection = ({ data, children, ...rest }) => {
  const { field_hero_images: fieldHeroImages } = data.relationships;
  const smallScreenImage = fieldHeroImages.find(
    (node) => {
      return node.field_orientation === 'vertical';
    }
  ).relationships.field_media_image.localFile.childImageSharp.gatsbyImageData;
  const largeScreenImage = fieldHeroImages.find(
    (node) => {
      return node.field_orientation === 'horizontal';
    }
  ).relationships.field_media_image.localFile.childImageSharp.gatsbyImageData;
  const sources = [
    smallScreenImage,
    {
      ...largeScreenImage,
      media: `(min-width: 720px)`
    }
  ];

  return (
    <section
      css={{
        backgroundColor: 'var(--color-blue-300)',
        backgroundImage: `url('${sources[1].images.fallback.src}')`,
        backgroundPosition: 'center',
        [MEDIA_QUERIES.LARGESCREEN]: {
          backgroundSize: 'cover'
        },
        position: 'relative'
      }}
      {...rest}
    >
      {children}
    </section>
  );
};

BackgroundSection.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  data: PropTypes.object
};
