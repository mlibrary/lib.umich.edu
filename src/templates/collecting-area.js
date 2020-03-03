import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING, Text } from '@umich-lib/core'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import TemplateLayout from './template-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import transformNodePanels from '../utils/transform-node-panels'
import getNode from '../utils/get-node'

function CollectingAreaTemplate({ data, ...rest }) {
  const node = getNode(data)
  const { field_title_context, body, fields } = node
  const { bodyPanels, fullPanels } = transformNodePanels({ node })

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
          {field_title_context}
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
          </div>

          {body && <HTML html={body.processed} />}
        </TemplateContent>
        <TemplateSide
          css={{
            '> div': {
              border: 'none',
              paddingLeft: '0',
              maxWidth: '38rem',
            },
          }}
        >
          [placeholder for side content]
        </TemplateSide>
      </Template>
    </TemplateLayout>
  )
}

export default CollectingAreaTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
  }
`
