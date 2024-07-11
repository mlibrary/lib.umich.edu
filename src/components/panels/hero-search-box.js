import {
  Button,
  COLORS,
  Icon,
  Input,
  Margins,
  MEDIA_QUERIES,
  SPACING,
  TYPOGRAPHY
} from '../../reusable';
import Html from '../html';
import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable id-length, sort-keys */
const MEDIAQUERIES = {
  XL: '@media only screen and (min-width: 1200px)',
  L: '@media only screen and (min-width:920px)',
  M: '@media only screen and (min-width: 720px)',
  S: MEDIA_QUERIES.LARGESCREEN
};
/* eslint-enable id-length, sort-keys */

const heroHeightCSS = {
  minHeight: '16rem',
  [MEDIAQUERIES.L]: {
    minHeight: '25rem'
  }
};

const frostCSS = {
  backdropFilter: 'blur(2px)',
  background: 'rgba(255,255,255,0.8)'
};

/*
 *We have two types of heros.
 *
 *1. One that puts provides access to Library Search, "lib_search_box"
 *2. A heading and HTML content on an image, "text"
 */
export default function HeroSearchBox ({ data }) {
  const hasFrost = data.field_background === 'white';
  const applyFrostCSS = hasFrost ? frostCSS : {};

  return (
    <Margins
      css={{
        // eslint-disable-next-line id-length
        a: {
          ':hover': {
            textDecorationThickness: '2px'
          },
          color: COLORS.neutral['400'],
          textDecoration: 'underline'
        },
        'a, span': {
          borderColor: 'white',
          boxShadow: 'none'
        },
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
      <BackgroundSection
        data={data}
        css={{
          ...heroHeightCSS
        }}
      >
        <div
          css={{
            ...heroHeightCSS,
            [MEDIAQUERIES.M]: {
              alignItems: 'center',
              display: 'flex',
              ...heroHeightCSS[MEDIAQUERIES.M]
            }
          }}
        >
          <div
            css={{
              margin: '0 auto',
              maxWidth: '28rem',
              padding: SPACING.M,
              [MEDIA_QUERIES.LARGESCREEN]: {
                padding: SPACING.L
              },
              [MEDIAQUERIES.M]: {
                borderRadius: '2px',
                margin: 0,
                marginLeft: SPACING['2XL'],
                maxWidth: '100%',
                padding: SPACING.XL,
                width: '34rem'
              },
              ...applyFrostCSS
            }}
          >
            <h1
              id='help-find'
              css={{
                margin: '0 auto',
                marginBottom: SPACING.XS,
                ...TYPOGRAPHY.M,
                fontWeight: '700',
                textAlign: 'center',
                [MEDIAQUERIES.M]: {
                  maxWidth: '100%',
                  padding: '0',
                  ...TYPOGRAPHY.XL,
                  textAlign: 'left'
                },
                [MEDIAQUERIES.L]: {
                  fontSize: '2.25rem'
                }
              }}
            >
              What can we help you find?
            </h1>
            <Search labelId='help-find' />
          </div>
        </div>
        <Caption data={data} />
      </BackgroundSection>
    </Margins>
  );
}

HeroSearchBox.propTypes = {
  data: PropTypes.object
};
/**
 * The background image to the hero is decorative, as it is
 * a background CSS style.
 *
 * But! We want to provide as much of an equitable experience
 * for everyone, so with a11y in mind, we will render
 * a visually hidden image in a figure with the
 * figcaption that is displayed. This will provide context
 * to the caption link that is not available from
 * the background image.
 */
const Caption = ({ data }) => {
  const caption = data.field_caption_text && data.field_caption_text.processed;
  const altText = data.relationships.field_hero_images[0].field_media_image.alt;

  if (!caption) {
    return null;
  }

  return (
    <div
      css={{
        borderRadius: '2px 0 0 0',
        bottom: '0',
        padding: `${SPACING['2XS']} ${SPACING.S}`,
        position: 'absolute',
        right: '0',
        ...frostCSS
      }}
    >
      <figure aria-hidden={altText ? 'false' : 'true'}>
        {altText && (
          <span className='visually-hidden'>
            <img alt={altText} />
          </span>
        )}
        {caption && (
          <figcaption>
            <Html html={caption} />
          </figcaption>
        )}
      </figure>
    </div>
  );
};

Caption.propTypes = {
  data: PropTypes.object
};

const BackgroundSection = ({ data, children, ...rest }) => {
  const { field_hero_images: fieldHeroImages } = data.relationships;
  const screenImage = (orientation) => {
    return fieldHeroImages
      .find((node) => {
        return node.field_orientation === orientation;
      })
      .relationships
      .field_media_image
      .localFile
      .childImageSharp
      .gatsbyImageData
      .images
      .fallback
      .src;
  };

  return (
    <section
      css={{
        backgroundColor: COLORS.neutral['100'],
        backgroundImage: `url('${screenImage('vertical')}')`,
        backgroundPosition: 'center top 33%',
        [MEDIAQUERIES.M]: {
          backgroundImage: `url('${screenImage('horizontal')}')`,
          backgroundPosition: 'center left 20%'
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
    PropTypes.object,
    PropTypes.array
  ]),
  data: PropTypes.object
};

const Search = ({ labelId }) => {
  return (
    <form
      action='https://search.lib.umich.edu/everything'
      method='get'
      css={{
        textAlign: 'center',
        [MEDIAQUERIES.M]: {
          textAlign: 'left'
        }
      }}
      role='search'
      aria-labelledby={labelId}
    >
      <label
        htmlFor='library-search-query'
        css={{
          display: 'block',
          paddingBottom: SPACING.XS
        }}
      >
        Search our
        {' '}
        <a href='https://search.lib.umich.edu/catalog?utm_source=lib-home'>
          catalog
        </a>
        ,
        {' '}
        <a href='https://search.lib.umich.edu/articles?utm_source=lib-home'>
          articles
        </a>
        , and more
      </label>
      <div
        css={{
          alignItems: 'flex-end',
          display: 'flex',
          input: {
            height: '40px'
          }
        }}
      >
        <Input id='library-search-query' type='search' name='query' />
        <input type='hidden' name='utm_source' value='lib-home' />
        <Button
          type='submit'
          kind='primary'
          css={{
            marginLeft: SPACING.XS
          }}
        >
          <Icon icon='search' size={20} />
          <span className='visually-hidden'>Submit</span>
        </Button>
      </div>
    </form>
  );
};

Search.propTypes = {
  labelId: PropTypes.string
};
