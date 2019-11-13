import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING, SmallScreen } from '@umich-lib/core'
import { Template, Top, Side, Content } from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/navigation/side-navigation'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import Panels from '../components/panels'
import TemplateLayout from './template-layout'
import useNavigationBranch from '../components/navigation/use-navigation-branch'

function BasicTemplate({ data, ...rest }) {
  const node = data.page ? data.page : data.room ? data.room : null

  const {
    title,
    body,
    fields,
    relationships,
    field_local_navigation,
  } = node

  const panelsData = relationships.field_panels ? relationships.field_panels : []
  const cardPanels = panelsData.filter(({ __typename }) => __typename === 'paragraph__card_panel')
  const panels = panelsData.filter(({ __typename }) => __typename !== 'paragraph__card_panel')
  
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
              {title}
            </Heading>
            {body && <HTML html={body.processed} />}
            <div css={{
              '[data-panel-margins]': {
                padding: '0'
              }
            }}>
              <Panels data={cardPanels} />
            </div>
          </Content>
        </Template>
      </Margins>
      <Panels data={panels} />
    </TemplateLayout>
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
