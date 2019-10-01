import React from 'react'
import BackgroundImage from 'gatsby-background-image-es5'
import VisuallyHidden from '@reach/visually-hidden'
import {
  Heading,
  SPACING,
  Margins,
  COLORS,
  Button,
  Icon,
  TextInput,
  MEDIA_QUERIES,
  TYPOGRAPHY,
} from '@umich-lib/core'
import HTML from '../html'

const MEDIAQUERIES = {
  'XL': '@media only screen and (min-width: 1200px)',
  'L': '@media only screen and (min-width:920px)',
  'M': '@media only screen and (min-width: 720px)',
  'S': MEDIA_QUERIES.LARGESCREEN
}

const heroHeightCSS = {
  minHeight: '18rem',
  [MEDIAQUERIES['L']]: {
    minHeight: '25rem'
  }
}

export default function HeroPanel({ data }) {
  const caption = data.field_caption_text.processed

  return (
    <Margins css={{
      padding: '0',
      [MEDIA_QUERIES.LARGESCREEN]: {
        padding: '0'
      },
      [MEDIAQUERIES['M']]: {
        padding: '0'
      },
      [MEDIAQUERIES['L']]: {
        padding: `0 ${SPACING['2XL']}`
      }
    }}>
      <BackgroundSection
        data={data}
        css={{
          ...heroHeightCSS,
        }}>
        <div css={{
          ...heroHeightCSS,
          [MEDIAQUERIES['M']]: {
            ...heroHeightCSS[MEDIAQUERIES['M']],
            display: 'flex',
            alignItems: 'center'
          }
        }}>
          <div css={{
            maxWidth: '28rem',
            margin: '0 auto',
            padding: SPACING['M'],
            paddingTop: SPACING['XL'],
            [MEDIAQUERIES['M']]: {
              width: '34rem',
              maxWidth: '100%',
              margin: 0,
              padding: SPACING['XL'],
            }
          }}>
            <h1
              id="help-find"
              css={{
                margin: '0 auto',
                marginBottom: SPACING['M'],
                ...TYPOGRAPHY['L'],
                fontWeight: '700',
                textAlign: 'center',
                maxWidth: '18rem',
                [MEDIAQUERIES['M']]: {
                  maxWidth: '100%',
                  padding: '0',
                  ...TYPOGRAPHY['XL'],
                  textAlign: 'left',
                  marginBottom: SPACING['M']
                },
                [MEDIAQUERIES['L']]: {
                  fontSize: '2.25rem',
                }
              }}
            >What can we help you find?</h1>
            <Search labelId={"help-find"} />
          </div>
        </div>
        <Caption caption={caption} />
      </BackgroundSection>
    </Margins>
  )
}

function Caption({ caption }) {
  return (
    <div css={{
      position: 'absolute',
      right: '0',
      bottom: '0',
      padding: `${SPACING['2XS']} ${SPACING['S']}`,
      background: 'rgba(0,0,0,0.6)',
      '*, a': {
        color: 'white',
        borderColor: 'white',
        boxShadow: 'none',
        ':hover': {
          boxShadow: 'none',
          color: 'white',
          borderColor: 'white'
        }
      },
      'a': {
        textDecoration: 'underline'
      }
    }}>
      <HTML html={caption} />
    </div>
  )
}

function BackgroundSection({ data, children, ...rest }) {
  const { field_hero_images } = data.relationships

  function getImageData(type) {
    return field_hero_images.find(
      node => node.field_orientation === type
    ).relationships.field_media_image.localFile.childImageSharp.fluid
  }
  
  return (
    <React.Fragment>
      <div css={{
        display: 'none',
        [MEDIAQUERIES['M']]: {
          display: 'block'
        }
      }}>
        <BackgroundImage
          Tag="section"
          fluid={getImageData('horizontal')}
          backgroundColor={`#040e18`}
          css={{
            backgroundPosition: 'center left 20%',
            backgroundSize: 'cover'
          }}
          {...rest}
        >
          {children}
        </BackgroundImage>
      </div>
      <div css={{
        display: 'block',
        [MEDIAQUERIES['M']]: {
          display: 'none'
        }
      }}>
        <BackgroundImage
          Tag="section"
          fluid={getImageData('vertical')}
          backgroundColor={`#040e18`}
          css={{
            backgroundPosition: 'center top 33%'
          }}
          {...rest}
        >
          {children}
        </BackgroundImage>
      </div>
    </React.Fragment>
  )
}

function Search({ labelId }) {
  return (
    <form
      action="https://search.lib.umich.edu/everything"
      method="get"
      css={{
        display: 'flex',
        height: '2.5rem',
        'input': {
          height: '100%'
        }
      }}
      role="search"
      aria-labelledby={labelId}
    >
      <TextInput
        id="search-query"
        labelText="Query"
        type="search"
        hideLabel
        name="query"
        placeholder="Search for books, journals, articles, and more"
      />
      <Button
        type="submit"
        kind="primary"
        css={{
          marginLeft: SPACING['XS']
        }}
      >
        <Icon icon="search" size={20} />
        <VisuallyHidden>Submit</VisuallyHidden>
      </Button>
    </form>
  )
}