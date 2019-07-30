import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import HTML from '../components/html'
import HorizontalNavigation from '../components/horizontal-navigation'
import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data'

export default function VisitTemplate({ data, ...rest }) {
  const {
    title,
    body,
    fields,
    relationships,
    field_root_page_
  } = data.page
  const parentNode = relationships.field_parent_page[0]
  const isRootPage = field_root_page_ ? true : false

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
        {body && <HTML html={body.processed}/>}
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
        processed
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