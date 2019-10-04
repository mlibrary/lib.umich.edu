import React from 'react'
import { graphql } from 'gatsby'

import VisuallyHidden from '@reach/visually-hidden'

import { Heading, Margins, MEDIA_QUERIES } from '@umich-lib/core'

import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import Prose from '../components/prose'
import Layout from '../components/layout'
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import PageHeaderMini from '../components/page-header-mini'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import Panels from '../components/panels'
import HTML from '../components/html'
import LocationAside from '../components/location-aside'

import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data'

function renderHorziontalNavigationCSS(isRootPage) {
  if (!isRootPage) {
    return {
      borderTop: 'none',
    }
  }

  return {}
}

function SectionTemplate({ data, ...rest }) {
  const {
    title,
    field_header_title,
    field_root_page_,
    body,
    field_horizontal_nav_title,
    fields,
    relationships,
    drupal_internal__nid,
  } = data.page

  const parentNode = relationships.field_parent_page[0]
  const breadcrumb = fields.breadcrumb
  const isRootPage = field_root_page_ ? true : false
  const pageHeaderImage =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const hasBody = body && body.processed && body.processed.length
  /*
    Use the parent page if not the root
    for PageHeader summary and image.
  */
  const summary = isRootPage ? body.summary : parentNode.body.summary

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO title={title} />

      {isRootPage ? (
        <PageHeader
          breadcrumb={breadcrumb}
          title={field_header_title}
          summary={summary}
          image={pageHeaderImage}
        />
      ) : (
        <PageHeaderMini breadcrumb={breadcrumb} title={field_header_title} />
      )}
      <HorizontalNavigation
        items={processHorizontalNavigationData({
          parentNodeOrderByDrupalId: rest.pageContext.parents,
          parentNodes: data.parents.edges,
          currentNode: data.page,
          childrenNodeOrderByDrupalId: rest.pageContext.children,
          childrenNodes: data.children.edges,
          isRootPage,
          parentNode,
        })}
        css={renderHorziontalNavigationCSS(isRootPage)}
      />

      {hasBody ? (
        <Template>
          <TemplateContent>
            <Prose>
              <Heading level={1} size="L">
                <VisuallyHidden>{title}</VisuallyHidden>
                <span aria-hidden="true">{field_horizontal_nav_title}</span>
              </Heading>

              {body && <HTML html={body.processed} />}
            </Prose>
          </TemplateContent>
          {relationships.field_design_template.field_machine_name ===
            'section_locaside' &&
            parentNode && (
              <TemplateSide
                css={{
                  display: 'none',
                  [MEDIA_QUERIES.LARGESCREEN]: {
                    display: 'block',
                  },
                }}
              >
                <LocationAside node={parentNode} />
              </TemplateSide>
            )}
        </Template>
      ) : (
        <Margins>
          <Heading level={1} size="L">
            <VisuallyHidden>{title}</VisuallyHidden>
            <span aria-hidden="true">{field_horizontal_nav_title}</span>
          </Heading>
        </Margins>
      )}

      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export default SectionTemplate

export const query = graphql`
  query($slug: String!, $parents: [String], $children: [String]) {
    page: nodeSectionPage(fields: { slug: { eq: $slug } }) {
      ...sectionFragment
    }
    parents: allNodeSectionPage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          ...sectionCardFragment
        }
      }
    }
    children: allNodeSectionPage(filter: { drupal_id: { in: $children } }) {
      edges {
        node {
          ...sectionCardFragment
        }
      }
    }
  }
`
