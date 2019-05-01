import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import HTML from "../components/html"
import styled from 'react-emotion'
import {
  MEDIA_QUERIES,
  Margins,
  Heading,
  SPACING,
  Alert,
} from '@umich-lib/core'

const StyledGrid = styled('div')({
  [MEDIA_QUERIES.LARGESCREEN]: {
    display: 'grid',
    gridTemplateColumns: 'auto 14rem',
    gridTemplateRows: 'max-content',
    gridTemplateAreas: `"main side"`,
    gridColumnGap: '2rem'
  }
})

const Prose = styled('div')({
  '> *:not(:last-child)': {
    marginBottom: SPACING['L']
  }
})

const PageTemplate = ({ data }) => {
  const {
    title,
    relationships,
    fields,
    body
  } = data.nodePage

  return (
    <Layout>
      <Margins>
        <StyledGrid>
          <main
            style={{
              gridArea: 'main',
              marginTop: SPACING['XL']
            }}
          >
            <Prose>
              <Heading size={"3XL"}>{title}</Heading>
              {body && body.format === 'basic_html' ? (
                <HTML html={body.value} />
              ) : (
                <Alert intent="warning">
                  <span style={{ fontSize: '1rem' }}>
                    This page does not have body content.
                  </span>
                </Alert>
              )}
            </Prose>
          </main>
        </StyledGrid>
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