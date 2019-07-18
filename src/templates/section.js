import React from 'react'
import { graphql } from "gatsby"

import {
  Heading,
  Margins,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import HorizontalNavigation from '../components/horizontal-navigation'
import Panels from '../components/panels'

import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data'

function SectionTemplate({ data, ...rest }) {
  const {
    title,
    field_header_title,
    field_horizontal_nav_title,
    field_root_page_,
    body,
    fields,
    relationships
  } = data.page
  const breadcrumb = fields.breadcrumb

  return (
    <Layout>
      <SEO title={title} />
      <PageHeader
        breadcrumb={breadcrumb}
        title={field_header_title}
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
          isRootPage: field_root_page_ ? true : false,
          parentNode: relationships.field_parent_page[0]
        })}
      />
      <Margins>
        <Heading
          size="L"
          level={1}
          css={{
            marginTop: SPACING['3XL']
          }}
        >{field_horizontal_nav_title}</Heading>
      </Margins>
      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export default SectionTemplate

export const query = graphql`
  fragment BuildingCardFragment on node__building {
    title
    body {
      summary
    }
    fields {
      slug
      breadcrumb
    }
    field_building_address {
      locality
      address_line1
      postal_code
      administrative_area
    }
    relationships {
      field_image {
        localFile {
          childImageSharp {
            fluid(maxWidth: 600, quality: 70) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
  }

  fragment SectionNodeFragment on node__section_page {
    title
    field_horizontal_nav_title
    fields {
      slug
    }
    drupal_id
  }

  fragment CardPanelFragment on paragraph__card_panel {
    field_title
    id
    relationships {
      field_card_template {
        field_machine_name
      }
      field_cards {
        ... on node__building {
          ...BuildingCardFragment
        }
      } 
    }
  }

  query($slug: String!, $parents: [String], $children: [String]) {
    page: nodeSectionPage(fields: { slug: { eq: $slug } }) {
      title
      field_header_title
      field_horizontal_nav_title
      field_root_page_
      body {
        summary
      }
      fields {
        breadcrumb
        slug
      }
      relationships {
        field_parent_page {
          ... on node__section_page {
            ...SectionNodeFragment
          }
        }
        field_image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 1280, quality: 70) {
                ...GatsbyImageSharpFluid_noBase64
              }
            }
          }
        }
        field_panels {
          ... on paragraph__card_panel {
            ...CardPanelFragment
          }
          ... on paragraph__text_panel {
            field_title
            id
            relationships {
              field_text_template {
                field_machine_name
              }
              field_text_card {
                field_title
                field_body {
                  processed
                }
              }
            }
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