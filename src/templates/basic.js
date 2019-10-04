import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING } from '@umich-lib/core'

import Layout from '../components/layout'
import SEO from '../components/seo'
import { Template, Top, Side, Content } from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/navigation/side-navigation'
import Panels from '../components/panels'

function BasicTemplate({ data, ...rest }) {
  const node = data.page
    ? data.page
    : data.room
    ? data.room
    : null

  const {
    title,
    body,
    drupal_internal__nid,
    fields,
    relationships,
    field_local_navigation,
  } = node

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
              <SideNavigation to={fields.slug} title={relationships.field_parent_page[0].title} />
            )}
          </Side>
          <Content>
            <Heading
              size="3XL"
              level={1}
              css={{
                marginBottom: SPACING['XL'],
              }}
            >
              {title}
            </Heading>
            {body && <HTML html={body.processed} />}
          </Content>
        </Template>
      </Margins>
      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export default BasicTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    room: nodeRoom(fields: { slug: { eq: $slug } }) {
      ...roomFragment
    }
  }
`
