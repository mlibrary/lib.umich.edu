import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Margins, Heading, SPACING, COLORS, Text } from '@umich-lib/core'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import TemplateLayout from './template-layout'
import Panels from '../components/panels'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import getNode from '../utils/get-node'
import transformNodePanels from '../utils/transform-node-panels'
import PlainLink from '../components/plain-link'
import IconText from '../components/icon-text'
import Link from '../components/link'

const qs = require('qs')

export default function NewsTemplate({ data }) {
  const node = getNode(data)
  const { bodyPanels, fullPanels } = transformNodePanels({ node })
  const { field_title_context, body, fields, relationships } = node
  const { slug } = fields
  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const imageCaption =
    relationships.field_media_image &&
    relationships.field_media_image.field_image_caption
      ? relationships.field_media_image.field_image_caption.processed
      : null

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
      </Margins>
      <Template asideWidth={'25rem'}>
        <TemplateContent>
          <Heading
            level={1}
            size="3XL"
            css={{
              marginTop: SPACING['S'],
              marginBottom: SPACING['L'],
            }}
          >
            {field_title_context}
          </Heading>
          {body && <HTML html={body.processed} />}
          {bodyPanels && <Panels data={bodyPanels} />}
        </TemplateContent>
        <TemplateSide
          css={{
            '> div': {
              border: 'none',
            },
          }}
        >
          {imageData && (
            <figure
              css={{
                maxWidth: '38rem',
                marginBottom: SPACING['XL'],
              }}
            >
              <Img
                css={{
                  width: '100%',
                  borderRadius: '2px',
                }}
                fluid={imageData}
              />
              {imageCaption && (
                <figcaption
                  css={{
                    paddingTop: SPACING['S'],
                    color: COLORS.neutral['300'],
                    paddingBottom: SPACING['XL'],
                    marginBottom: SPACING['XL'],
                    borderBottom: `solid 1px ${COLORS.neutral['100']}`,
                  }}
                >
                  <HTML
                    html={
                      relationships.field_media_image.field_image_caption
                        .processed
                    }
                  />
                </figcaption>
              )}
            </figure>
          )}

          <Share
            url={'https://lib.umich.edu' + slug}
            title={field_title_context}
          />
          <StayInTheKnow />
        </TemplateSide>
      </Template>

      <Panels data={fullPanels} />
    </TemplateLayout>
  )
}

function StayInTheKnow() {
  const newsEmailSignUpURL =
    'https://visitor.r20.constantcontact.com/manage/optin?v=001cDYOOus5TIdow4bzSVycvi7isF9mU_8aHCjw2GQahcr0Lv7Y_AmQ4Rk6XLOHcZXb6ieJPlgd4mmjhTWZtwsIPqu_3PBhHLOFjEqR0fdjI2A%3D'

  return (
    <React.Fragment>
      <Heading
        level={2}
        size="XS"
        css={{
          marginTop: SPACING['L'],
          paddingTop: SPACING['L'],
          borderTop: `solid 1px ${COLORS.neutral['100']}`,
          fontWeight: '600',
        }}
      >
        Stay in the know
      </Heading>
      <Text>
        {' '}
        <Link
          to={newsEmailSignUpURL}
          css={{
            display: 'inline-block',
          }}
        >
          Sign up
        </Link>{' '}
        for email updates from the library.
      </Text>
    </React.Fragment>
  )
}

function Share({ url, title }) {
  const emailProps = qs.stringify({
    subject: title,
    body: `Read the latest from the University of Michigan Library: ${url}`,
  })

  const twitterProps = qs.stringify({
    url,
    text: `${title} @UMichLibrary`,
  })

  const fbProps = qs.stringify({
    u: url,
    t: title,
  })

  const options = [
    {
      text: 'Facebook',
      to: `http://www.facebook.com/sharer/sharer.php?${fbProps}`,
      icon: 'facebook',
    },
    {
      text: 'Twitter',
      to: `https://twitter.com/share?${twitterProps}`,
      icon: 'twitter',
    },
    {
      text: 'Email',
      to: `mailto:?${emailProps}`,
      icon: 'email',
    },
  ]

  return (
    <React.Fragment>
      <Heading
        level={2}
        size="XS"
        css={{
          fontWeight: '600',
        }}
      >
        Share
      </Heading>
      <ul>
        {options.map(({ text, to, icon, d }, y) => {
          return (
            <li key={y + to + text}>
              <PlainLink
                to={to}
                css={{
                  display: 'inline-block',
                  padding: `${SPACING['XS']} 0`,
                  svg: {
                    color: COLORS.neutral['300'],
                  },
                  ':hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <IconText icon={icon} d={d}>
                  {text}
                </IconText>
              </PlainLink>
            </li>
          )
        })}
      </ul>
    </React.Fragment>
  )
}

export const query = graphql`
  query($slug: String!) {
    news: nodeNews(fields: { slug: { eq: $slug } }) {
      ...newsFragment
    }
  }
`
