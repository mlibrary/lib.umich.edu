import React from 'react'
import { graphql } from "gatsby"
import VisuallyHidden from "@reach/visually-hidden";

import {
  Margins,
  Heading,
  List,
  SPACING,
  MEDIA_QUERIES
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import Prose from "../components/prose"
import HorizontalNavigation from '../components/horizontal-navigation'
import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data'
import HTML from '../components/html'

export default function VisitTemplate({ data, ...rest }) {
  const {
    title,
    field_horizontal_nav_title,
    fields,
    relationships,
    body,
    field_root_page_,
    field_access
  } = data.page
  const parentNode = relationships.field_parent_page[0]
  const isRootPage = field_root_page_ ? true : false

  const {
    field_visit,
    field_parking,
    field_amenities
  } = relationships

  return (
    <Layout>
      <SEO title={title} />
      <PageHeader
        breadcrumb={fields.breadcrumb}
        title={title}
        summary={body ? body.summary : null}
        image={relationships.field_media_image.relationships.field_media_image}
      />
      <HorizontalNavigation
        items={processHorizontalNavigationData({
          parentNodeOrderByDrupalId: rest.pageContext.parents,
          parentNodes: data.parents.edges,
          currentNode: data.page,
          childrenNodeOrderByDrupalId: rest.pageContext.children,
          childrenNodes: data.children.edges,
          isRootPage,
          parentNode
        })}
      />
      <Margins>
        <div css={{
          paddingTop: SPACING['XL'],
          paddingBottom: SPACING['XL'],
          [MEDIA_QUERIES.LARGESCREEN]: {
            paddingTop: SPACING['3XL'],
            paddingBottom: SPACING['3XL'],
          }
        }}>
          <Prose>
            <Heading level="1" size="XL">
              <VisuallyHidden>{title}</VisuallyHidden>
              <span aria-hidden="true">{field_horizontal_nav_title}</span>
            </Heading>
            <HTMLList data={field_visit} />

            <Heading level="2" size="M">Getting here</Heading>
            <Heading level="3" size="XS">Parking</Heading>
            <HTMLList data={field_parking} />

            <Heading level="3" size="XS">Access</Heading>
            <HTML html={field_access.processed} />

            <Heading level="2" size="M">Amentities</Heading>
            <List type="bulleted">
              {field_amenities.map(({name}, i) => <li key={i + name}>{name}</li>)}
            </List>
          </Prose>
        </div>
      </Margins>
    </Layout>
  )
}

function HTMLList({ data }) {
  return (
    <List type="bulleted">
      {data.map(({description}, i) => <li key={i + description.processed}><HTML html={description.processed} /></li>)}
    </List>
  )
}

export const query = graphql`
  query($slug: String!, $parents: [String], $children: [String]) {
    page: nodeBuilding(fields: { slug: { eq: $slug } }) {
      ...BuildingFragment
    }
    parents: allNodeSectionPage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          ...SectionNodeFragment
        }
      }
    }
    children: allNodeSectionPage(filter: { drupal_id: { in: $children } }) {
      edges {
        node {
          ...SectionNodeFragment
        }
      }
    }
  }
`