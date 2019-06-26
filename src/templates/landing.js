import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
} from '@umich-lib/core'

import Layout from "../components/layout"
import PageHeader from '../components/page-header'
import HTML from '../components/html'
import Panels from '../components/panels'

export default function LandingTemplate({ data, ...rest }) {
  const {
    title,
    body,
    fields,
    relationships
  } = data.page

  return (
    <Layout>
      <PageHeader
        breadcrumb={fields.breadcrumb}
        title={title}
        summary={body.summary}
        image={relationships.field_image}
      />
      <Margins>
        {body && <HTML html={body.value}/>}
      </Margins>
      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      title
      fields {
        breadcrumb
      }
      body {
        value
        summary
      }
      relationships {
        field_image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 1200, quality: 80) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
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
                  title
                  body {
                    summary
                  }
                  fields {
                    slug
                  }
                  relationships {
                    field_image {
                      localFile {
                        childImageSharp {
                          fluid(maxWidth: 800, quality: 80) {
                            ...GatsbyImageSharpFluid
                          }
                        }
                      }
                    }
                  }
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