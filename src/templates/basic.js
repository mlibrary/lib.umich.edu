import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import {
  Template,
  Top,
  Side,
  Content
} from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/side-navigation'

function BasicTemplate({ data, ...rest }) {
  const {
    title,
    body,
    fields,
    relationships
  } = data.page

  return (
    <Layout>
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={fields.breadcrumb} />
          </Top>
          <Side>
            <SideNavigation
              parent={relationships.field_parent_page}
              data={data.parents}
              parentOrder={rest.pageContext.parents}
            />
          </Side>
          <Content>
            <Heading size="3XL" level={1} css={{
              marginBottom: SPACING['XL']
            }}>{title}</Heading>
            {body && <HTML html={body.value}/>}
          </Content>
        </Template>
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
        breadcrumb
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