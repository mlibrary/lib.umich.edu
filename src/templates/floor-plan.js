import React from 'react'
import { graphql } from 'gatsby'
import { Margins, Heading, SPACING, SmallScreen } from '@umich-lib/core'

import { Template, Top, Side, Content } from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/navigation/side-navigation'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import TemplateLayout from './template-layout'
import useNavigationBranch from '../components/navigation/use-navigation-branch'

function FloorPlanTemplate({ data }) {
  const node = data.floorPlan
  const { field_title_context, body, fields, field_local_navigation } = node
  const navBranch = useNavigationBranch(fields.slug)
  const smallScreenBranch = useNavigationBranch(fields.slug, 'small')
  const smallScreenItems = smallScreenBranch ? smallScreenBranch.children : null

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={fields.breadcrumb} />
          </Top>
          <Side>
            {field_local_navigation && (
              <SideNavigation to={fields.slug} branch={navBranch} />
            )}
            {field_local_navigation && smallScreenItems && (
              <SmallScreen>
                <div
                  css={{
                    margin: `0 -${SPACING['M']}`,
                  }}
                >
                  <HorizontalNavigation items={smallScreenItems} />
                </div>
              </SmallScreen>
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
              {field_title_context}
            </Heading>
            {body && <HTML html={body.processed} />}
            [svg placeholder]
          </Content>
        </Template>
      </Margins>
    </TemplateLayout>
  )
}

export default FloorPlanTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodeFloorPlan(fields: { slug: { eq: $slug } }) {
      ...floorPlanFragment
    }
  }
`
