import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import HTML from "../components/html"
import styled from '@emotion/styled'
import {
  Margins,
  Heading,
  SPACING,
  Alert,
  Text,
  MEDIA_QUERIES
} from '@umich-lib/core'
import Breadcrumbs from '../components/breadcrumbs'

const Prose = styled('div')({
  '> *:not(:last-child)': {
    marginBottom: SPACING['L']
  }
})

const PageTemplate = ({ data }) => {
  const {
    title,
    body,
    fields
  } = data.nodePage

  return (
    <Layout>
      <Margins>
        <div css={{
          marginTop: SPACING['L'],
          [MEDIA_QUERIES.LARGESCREEN]: {
            marginTop: SPACING['2XL']
          }
        }}>
          <Breadcrumbs data={fields.breadcrumb} />
          <main
            style={{
              maxWidth: '38rem',
              marginTop: SPACING['XL']
            }}
          >
            <Prose>
              <Heading size={"3XL"}>{title}</Heading>
              {body && body.format === 'basic_html' ? (
                <React.Fragment>
                  {body.summary && (
                    <Text lede>{body.summary}</Text>
                  )}
                  <HTML html={body.value} />
                </React.Fragment>
              ) : (
                <Alert intent="warning">
                  <span style={{ fontSize: '1rem' }}>
                    This page does not have body content.
                  </span>
                </Alert>
              )}
            </Prose>
          </main>
        </div>
      </Margins>
    </Layout>
  )
}

export default PageTemplate

export const query = graphql`
  query($slug: String!) {
    nodePage(fields: { slug: { eq: $slug } }) {
      title
      body {
        value
        format
        summary
      }
      fields {
        breadcrumb {
          to
          text
        }
      }
      relationships {
        node__page {
          title
          path {
            alias
          }
          relationships {
            node__page {
              title
              path {
                alias
              }
              relationships {
                node__page {
                  title
                  path {
                    alias
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