import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading
} from '@umich-lib/core'

import Layout from "../components/layout"
import PageHeader from '../components/page-header'
import HTML from '../components/html'

export default function({ data }) {
  const {
    title,
    body
  } = data.page

  return (
    <Layout>
      <Margins>
        <Heading size="3XL" level="1">{title}</Heading>

        {body && <HTML html={body.value} />}
      </Margins>
    </Layout>
  )

}

/*
export const query = graphql`
  query($slug: String! ) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      title
      body {
        value
      }
    }
  }
`
*/