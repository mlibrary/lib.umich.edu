import React from 'react'
import { graphql } from 'gatsby'
import {
  Margins,
  Heading,
  SPACING,
  SmallScreen,
  LINK_STYLES,
  Z_SPACE,
  COLORS,
} from '@umich-lib/core'

import { Template, Top, Side, Content } from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/navigation/side-navigation'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import Prose from '../components/prose'
import TemplateLayout from './template-layout'
import useNavigationBranch from '../components/navigation/use-navigation-branch'

function FloorPlanTemplate({ data }) {
  const node = data.floorPlan
  const {
    title,
    field_title_context,
    body,
    fields,
    field_local_navigation,
  } = node
  const { field_svg_image, field_printable_image } = node.relationships
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

            <p
              css={{
                marginTop: SPACING['L'],
              }}
            >
              <a
                href={encodeURI(field_printable_image.localFile.publicURL)}
                css={LINK_STYLES['default']}
              >
                {title} PDF
              </a>
            </p>

            <a
              href={encodeURI(field_printable_image.localFile.publicURL)}
              css={{
                display: 'block',
                marginTop: SPACING['2XL'],
                maxWidth: '38rem',
                borderRadius: '2px',
                border: `solid 1px ${COLORS.neutral['100']}`,
                ':hover': {
                  cursor: 'pointer',
                  ...Z_SPACE['8'],
                },
              }}
            >
              <img
                src={encodeURI(field_svg_image.localFile.publicURL)}
                alt={title + ' PDF'}
                css={{
                  display: 'block',
                  width: '100%',
                }}
              />
            </a>
          </Content>
        </Template>
      </Margins>
    </TemplateLayout>
  )
}

export default FloorPlanTemplate

export const query = graphql`
  query($slug: String!) {
    floorPlan: nodeFloorPlan(fields: { slug: { eq: $slug } }) {
      ...floorPlanFragment
    }
  }
`
