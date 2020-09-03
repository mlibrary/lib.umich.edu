import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import * as moment from 'moment'
import {
  Margins,
  Heading,
  SPACING,
  COLORS,
  Text,
  TYPOGRAPHY,
} from '@umich-lib/core'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import TemplateLayout from './template-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import getNode from '../utils/get-node'

/*
  TODO:
  - [ ] Add events to build as a template.
  - [ ] Figure out how to reuse the share stuff with the news template.
  - [ ] Figure out Add to calendar button.
  - [ ] Figure out contact... that's probably somewhere else also.
  - [ ] Add event statement.
  - [ ] There is that date, directions, and type thing at the top.
*/

export default function EventTemplate({ data }) {
  const node = data.event
  const { field_title_context, body, fields, relationships } = node
  const image =
    relationships?.field_media_image?.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const imageCaptionHTML =
    relationships?.field_media_image?.field_image_caption?.processed

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
              marginBottom: SPACING['XL'],
            }}
          >
            {field_title_context}
          </Heading>
          {body && <HTML html={body.processed} />}
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
              {imageCaptionHTML && (
                <figcaption
                  css={{
                    paddingTop: SPACING['S'],
                    color: COLORS.neutral['300'],
                  }}
                >
                  <HTML html={imageCaptionHTML} />
                </figcaption>
              )}
            </figure>
          )}
        </TemplateSide>
      </Template>
    </TemplateLayout>
  )
}

export const query = graphql`
  query($slug: String!) {
    event: nodeEventsAndExhibits(fields: { slug: { eq: $slug } }) {
      ...eventFragment
    }
  }
`
