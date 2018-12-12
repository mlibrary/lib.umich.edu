import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import Navigation from "../components/navigation"
import BreadCrumbs from "../components/breadcrumbs"
import Markdown from "../components/markdown"
import styled from 'react-emotion'
import {
  MEDIA_QUERIES
} from '@umich-lib/styles'

const StyledGrid = styled('div')({
  [MEDIA_QUERIES.LARGESCREEN]: {
    display: 'grid',
    gridTemplateColumns: 'auto 14rem',
    gridTemplateRows: 'max-content',
    gridTemplateAreas: `"main side"`,
    gridColumnGap: '2rem'
  }
})

const PageTemplate = ({ data }) => {
  const {
    title,
    relationships
  } = data.nodePage
  const {
    markdownBody
  } = data.nodePage.fields

  return (
    <Layout>
      <div data-inner-container>
        <BreadCrumbs />
        <StyledGrid>
          <main
            style={{
              gridArea: 'main'
            }}
          >
            <h1>{title}</h1>
            {markdownBody ? (
              <Markdown ast={markdownBody.childMarkdownRemark.htmlAst} />
            ) : (
              <p>No content here yet. Try adding body content in the Drupal admin.</p>
            )}
          </main>
          <div style={{
            gridArea: 'side'
          }}>
            {relationships.node__page && (
              <Navigation data={relationships.node__page} />
            )}
          </div>
        </StyledGrid>
      </div>
    </Layout>
  )
}

export default PageTemplate

export const query = graphql`
  query($slug: String!) {
    nodePage(fields: { slug: { eq: $slug } }) {
      title
      fields {
        html
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