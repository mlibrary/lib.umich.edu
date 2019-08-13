import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import {
  Template,
  Top,
  Side,
  Content
} from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/side-navigation'
import Panels from '../components/panels'

function BasicTemplate({ data, ...rest }) {
  const {
    title,
    body,
    drupal_internal__nid,
    fields,
    relationships,
    field_local_navigation
  } = data.page

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO title={title} />
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={fields.breadcrumb} />
          </Top>
          <Side>
            {field_local_navigation && (
              <SideNavigation
                parent={relationships.field_parent_page}
                data={data.parents}
                parentOrder={rest.pageContext.parents}
              />
            )}
          </Side>
          <Content>
            <Heading size="3XL" level={1} css={{
              marginBottom: SPACING['XL']
            }}>{title}</Heading>
            {body && <HTML html={body.processed}/>}
          </Content>
        </Template>
      </Margins>
      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export default BasicTemplate

export const query = graphql`
  query($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...PageFragment
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