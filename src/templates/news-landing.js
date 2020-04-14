import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING } from '@umich-lib/core'
import Layout from '../components/layout'
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import HTML from '../components/html'
import Panels from '../components/panels'
import Breadcrumb from '../components/breadcrumb'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'

export default function NewsLandingTemplate({ data }) {
  const node = data.page
  const {
    title,
    field_title_context,
    body,
    fields,
    relationships,
    drupal_internal__nid,
  } = node
  const description = body && body.summary ? body.summary : null

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO
        title={title}
        drupalNid={drupal_internal__nid}
        description={description}
      />
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['S'],
          }}
        >
          {field_title_context}
        </Heading>
      </Margins>
      <Template>
        <TemplateSide>
          <p>placeholder</p>
        </TemplateSide>
        <TemplateContent>
          {body && <HTML html={body.processed} />}
        </TemplateContent>
      </Template>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
  }
`
