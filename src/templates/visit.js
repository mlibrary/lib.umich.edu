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

export default function VisitTemplate({ data, ...rest }) {
  const {
    title,
    field_horizontal_nav_title,
    fields,
    relationships,
    body,
    field_root_page_
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
        image={relationships.field_image}
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
            <List type="bulleted">
              {field_visit.map(({name}, i) => <li key={i + name}>{name}</li>)}
            </List>

            <Heading level="2" size="M">Getting here</Heading>

            <Heading level="3" size="XS">Parking</Heading>
            <List type="bulleted">
              {field_parking.map(({name}, i) => <li key={i + name}>{name}</li>)}
            </List>

            <Heading level="2" size="M">Amentities</Heading>
            <List
              type="bulleted"
              css={{
                columns: '2',
                columnGap: SPACING['2XL']
              }}
            >
              {field_amenities.map(({name}, i) => <li key={i + name}>{name}</li>)}
            </List>
          </Prose>
        </div>
      </Margins>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $parents: [String], $children: [String]) {
    page: nodeBuilding(fields: { slug: { eq: $slug } }) {
      title
      field_horizontal_nav_title
      field_root_page_
      fields {
        breadcrumb
        slug
      }
      body {
        summary
      }
      relationships {
        field_image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 1280, quality: 70) {
                ...GatsbyImageSharpFluid_noBase64
              }
            }
          }
        }
        field_parent_page {
          ... on node__section_page {
            ...SectionNodeFragment
          }
        }
        field_visit {
          name
        }
        field_parking {
          name
        }
        field_amenities {
          name
        }
      }
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