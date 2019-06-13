import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading
} from '@umich-lib/core'

import Layout from "../components/layout"
import Breadcrumb from '../components/breadcrumb'
import HTML from '../components/html'
import {
  Template,
  Top,
  Content
} from '../components/page-layout'

export default function({ data }) {
  const {
    title,
    body,
    fields
  } = data.page

  return (
    <Layout>
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={fields.breadcrumb} />
          </Top>
          <Content>
            <Heading size="3XL" level="1">{title}</Heading>

            {body && <HTML html={body.value} />}
          </Content>
        </Template>
      </Margins>
    </Layout>
  )

}

export const query = graphql`
  query($slug: String! ) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      title
      body {
        value
      }
      fields {
        breadcrumb
      }
    }
  }
`