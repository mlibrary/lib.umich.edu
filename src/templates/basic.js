import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/side-navigation'

function BasicTemplate({ data }) {
  const {
    title,
    body,
    fields,
    relationships
  } = data.page

  return (
    <Layout>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
          <div css={{
            display: 'flex',
            '> nav': {
              flex: '0 0 18rem'
            }
          }}>
          <SideNavigation parent={relationships.field_parent_page} data={data.parents} />
          <div css={{
            maxWidth: '38rem',
            marginBottom: SPACING['3XL']
          }}>
            <Heading size="3XL" level="1" css={{
              marginBottom: SPACING['XL']
            }}>{title}</Heading>
            {body && <HTML html={body.value} />}
          </div>
        </div>
      </Margins>
    </Layout>
  )
}

export default BasicTemplate

export const query = graphql`
  query($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      title
      fields {
        breadcrumb {
          text
          to
        }
      }
      body {
        value
      }
      relationships {
        field_parent_page {
          ... on node__page {
            title
            fields {
              slug
            }
          }
        }
      }
    }
    parents: allNodePage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          id
          title
          fields {
            slug
          }
        }
      }
    }
  }
`