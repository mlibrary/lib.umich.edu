import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import HorizontalNavigation from '../components/horizontal-navigation'
import Panels from '../components/panels'

export default function FullWidthTemplate({ data, ...rest }) {
  const {
    title,
    body,
    fields,
    drupal_internal__nid,
    relationships
  } = data.page

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO title={title} />
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
        >
          {title}
        </Heading>
      </Margins>

      <HorizontalNavigation
        data={data.parents}
        parentOrder={rest.pageContext.parents}
      />

      <Margins>
        {body && <HTML html={body.processed}/>}
      </Margins>
      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      title
      drupal_internal__nid
      fields {
        breadcrumb
      }
      body {
        processed
      }
      relationships {
        field_parent_page {
          ... on node__page {
            title
            fields {
              slug
            }
          }
        }
        field_panels {
          ... on paragraph__card_panel {
            field_title
            id
            relationships {
              field_card_template {
                field_machine_name
              }
              field_cards {
                ... on node__page {
                  title
                  body {
                    summary
                  }
                  fields {
                    slug
                  }
                }
                ... on node__building {
                  ...BuildingFragment
                }
              } 
            }
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
                field_link {
                  uri
                }
                field_body {
                  processed
                }
              }
            }
          }
        }
      }
    }
    parents: allNodePage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          title
          drupal_id
          fields {
            slug
          }
        }
      }
    }
  }
`