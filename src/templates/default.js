import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import HTML from '../components/html'

export default function({ data }) {
  const {
    title,
    body
  } = data.page

  return (
    <Layout>
      <Margins>
        <div css={{
          maxWidth: '38rem'
        }}>
          <Heading size="3XL" level="1" css={{
            marginTop: SPACING['2XL'],
            marginBottom: SPACING['XL']
          }}>{title}</Heading>
          {body && <HTML html={body.value} />}
        </div>
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
    }
  }
`