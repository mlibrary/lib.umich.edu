import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'

import { Heading, SPACING, Margins, Text } from '@umich-lib/core'

import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import Breadcrumb from '../components/breadcrumb'
import TemplateLayout from './template-layout'
import getNode from '../utils/get-node'
import Panels from '../components/panels'
import HTML from '../components/html'
import DestinationLocationInfo from '../components/destination-location-info'

function DestinationTemplate({ data, ...rest }) {
  const node = getNode(data)

  const { title, fields, body, relationships } = node
  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          level={1}
          size="3XL"
          css={{
            marginTop: SPACING['S'],
            marginBottom: SPACING['L'],
          }}
        >
          {title}
        </Heading>
      </Margins>
      <Template asideWidth={'26rem'}>
        <TemplateContent>
          <div
            css={{
              maxWidth: '38rem',
            }}
          >
            {body && body.summary && (
              <Text
                lede
                css={{
                  marginBottom: SPACING['XL'],
                }}
              >
                {body.summary}
              </Text>
            )}

            <DestinationLocationInfo node={node} />
          </div>

          {body && <HTML html={body.processed} />}

          <Panels data={relationships.field_panels} />
        </TemplateContent>
        {imageData && (
          <TemplateSide
            css={{
              '> div': {
                border: 'none',
                paddingLeft: '0',
                maxWidth: '38rem',
              },
            }}
          >
            <Img
              css={{
                width: '100%',
                borderRadius: '2px',
              }}
              fluid={imageData}
            />
          </TemplateSide>
        )}
      </Template>
    </TemplateLayout>
  )
}

export default DestinationTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    room: nodeRoom(fields: { slug: { eq: $slug } }) {
      ...roomFragment
    }
  }
`
