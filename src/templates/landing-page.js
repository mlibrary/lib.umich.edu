import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import Navigation from "../components/navigation"

const LandingPageTemplate = ({ data }) => {
  const {
    title,
    relationships
  } = data.landingPages

  return (
    <Layout>
      <main>
        <h1>{title}</h1>
        <p>This is a landing page. They do not have body content (yet).</p>
      </main>

      {relationships.pages && <Navigation data={relationships.pages} />}
    </Layout>
  )
}

export default LandingPageTemplate

export const query = graphql`
  query($slug: String!) {
    landingPages(fields: { slug: { eq: $slug } }) {
      title
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