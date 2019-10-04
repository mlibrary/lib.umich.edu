import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING, SmallScreen } from '@umich-lib/core'

import Layout from '../components/layout'
import SEO from '../components/seo'
import { Template, Top, Side, Content } from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/navigation/side-navigation'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import Panels from '../components/panels'
import useNavigationBranch from '../components/navigation/use-navigation-branch'

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

  const navBranch = useNavigationBranch(fields.slug)
  const smallScreenBranch = useNavigationBranch(fields.slug, 'small')

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
              <SideNavigation to={fields.slug} branch={navBranch} />
            )}
          </Side>
          <Content>
            <Heading
              size="3XL"
              level={1}
              css={{
                marginBottom: SPACING['L'],
              }}
            >
              {title}
            </Heading>
            {field_local_navigation && smallScreenBranch && (
              <SmallScreen>
                <div css={{
                  margin: `0 -${SPACING['M']}`
                }}>
                  <HorizontalNavigation items={smallScreenBranch.children} />
                </div>
              </SmallScreen>
            )}
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
