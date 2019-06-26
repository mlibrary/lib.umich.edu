import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import {
  Template,
  Top,
  Side,
  Content
} from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/side-navigation'
import Panels from '../components/panels'

function BasicTemplate({ data, ...rest }) {
  const {
    title,
    body,
    fields,
    relationships
  } = data.page

  return (
    <Layout>
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={fields.breadcrumb} />
          </Top>
          <Side>
            <SideNavigation
              parent={relationships.field_parent_page}
              data={data.parents}
              parentOrder={rest.pageContext.parents}
            />
          </Side>
          <Content>
            <Heading size="3XL" level={1} css={{
              marginBottom: SPACING['XL']
            }}>{title}</Heading>
            {body && <HTML html={body.value}/>}
          </Content>
        </Template>

        <Panels data={relationships.field_panels} />
      </Margins>
    </Layout>
  )
}

export default BasicTemplate

export const query = graphql`
  query($slug: String!, $parents: [String]) {
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