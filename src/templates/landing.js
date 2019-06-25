import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'

export default function({ data }) {
  const {
    title,
    body,
    fields
  } = data.page

  return (
    <Layout>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <div css={{
          maxWidth: '38rem',
          marginBottom: SPACING['3XL']
        }}>
          <Heading size="3XL" level="1" css={{
            marginBottom: SPACING['XL']
          }}>{title}</Heading>
          {body && <HTML html={body.value} />}
        </div>
      </Margins>
    </Layout>
  )

}

export const query = graphql`
  query($slug: String! ) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      title
      fields {
        breadcrumb {
          text
          to
        }
      }
      body {
        value
      }
      relationships {
        field_panels {
          ... on paragraph__text_panel {
            field_title
            relationships {
              field_text_card {
                field_title
                field_body {
                  processed
                }
              }
            }
          }
          ... on paragraph__card_panel {
            field_title
            relationships {
              field_cards {
                ... on node__building {
                  title
                  body {
                    summary
                  }
                }
                ... on node__page {
                  title
                  body {
                    summary
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`