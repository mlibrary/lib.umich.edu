import React from 'react'
import { graphql } from "gatsby"

import {
  Margins
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import PageHeader from '../components/page-header'

function SectionTemplate({ data, ...rest }) {
  const {
    title,
    field_header_title,
    field_horizontal_nav_title,
    fields,
    body
  } = data.page

  return (
    <Layout>
      <SEO title={title} />
      <PageHeader
        breadcrumb={fields.breadcrumb}
        title={field_header_title}
        summary={body ? body.summary : null}
      />
      <Margins>
        {field_horizontal_nav_title}
      </Margins>
    </Layout>
  )
}

export default SectionTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodeSectionPage(fields: { slug: { eq: $slug } }) {
      title
      field_header_title
      field_horizontal_nav_title
      fields {
        breadcrumb
      }
    }
  }
`