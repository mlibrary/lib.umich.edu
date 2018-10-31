import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import Navigation from "../components/navigation"

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
      <main>
        <h1>{title}</h1>
        {html ? (
          <div dangerouslySetInnerHTML={{__html: html}} />
        ) : (
          <p>This page has no body content.</p>
        )}
        {relationships.pages && <Navigation data={relationships.pages} />}
      </main>
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
        }
      }
    }
  }
`