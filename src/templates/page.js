import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import Navigation from "../components/navigation"
import BreadCrumbs from "../components/breadcrumbs"
import styled from 'react-emotion'
import {
  MEDIA_QUERIES
} from '@umich-lib-ui/styles'

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
  } = data.pages
  const {
    html
  } = data.pages.fields

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
            {html ? (
              <div dangerouslySetInnerHTML={{__html: html}} />
            ) : (
              <p>No content here yet.</p>
            )}
          </main>
          <div style={{
            gridArea: 'side'
          }}>
            {relationships.pages && (
              <Navigation data={relationships.pages} />
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
    pages(fields: { slug: { eq: $slug } }) {
      title
      fields {
        html
      }
      relationships {
        pages {
          title
          path {
            alias
          }
          relationships {
            pages {
              title
              path {
                alias
              }
              relationships {
                pages {
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