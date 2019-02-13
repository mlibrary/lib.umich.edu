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
    relationships,
    fields
  } = data.nodePage

  return (
    <Layout>
      <div data-inner-container>
        <BreadCrumbs data={fields.breadcrumb} />
        <StyledGrid>
          <main
            style={{
              gridArea: 'main'
            }}
          >
            <h1>{title}</h1>

            <p>Not able to render body content yet.</p>
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
        breadcrumb {
          text
          to
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