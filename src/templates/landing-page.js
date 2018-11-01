import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"

const LandingPageTemplate = ({ data }) => {
  const {
    title,
    relationships
  } = data.landingPages
  const {
    html
  } = data.landingPages.fields

  return (
    <Layout>
      <main>
        <h1>This is the index page</h1>
        {html && (
          <div dangerouslySetInnerHTML={{__html: html}} />
        )}
      </main>
    </Layout>
  )
}

export default LandingPageTemplate

export const query = graphql`
  query($slug: String!) {
    landingPages(fields: { slug: { eq: $slug } }) {
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
        }
      }
    }
  }
`