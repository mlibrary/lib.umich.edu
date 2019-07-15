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
import Panels from '../components/panels'

export default function FullWidthTemplate({ data, ...rest }) {
  const {
    title,
    body,
    fields,
    relationships
  } = data.page

  return (
    <Layout>
      <SEO title={title} />
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['XL']
          }}
        >
          {title}
        </Heading>
        {body && <HTML html={body.value}/>}
      </Margins>
      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      title
      fields {
        breadcrumb
      }
      body {
        value
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
                          fluid(maxWidth: 600, quality: 70) {
                            ...GatsbyImageSharpFluid_noBase64
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
  }
`