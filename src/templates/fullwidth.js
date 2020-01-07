import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING } from '@umich-lib/core'

import TemplateLayout from './template-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import Panels from '../components/panels'

export default function FullWidthTemplate({ data, ...rest }) {
  const node = data.page
  const { field_title_context, body, fields, relationships } = node
  const panels = relationships.field_panels

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: panels.length ? '0' : SPACING['XL'],
          }}
        >
          {field_title_context}
        </Heading>
      </Margins>

      <HorizontalNavigation
        data={data.parents}
        parentOrder={rest.pageContext.parents}
      />

      {body && (
        <Margins
          css={{
            marginBottom: panels.length ? '0' : SPACING['5XL'],
          }}
        >
          <HTML html={body.processed} />
        </Margins>
      )}

      <Panels data={panels} />
    </TemplateLayout>
  )
}

export const query = graphql`
  query($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    parents: allNodePage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          title
          drupal_id
          fields {
            slug
          }
        }
      }
    }
  }
`
