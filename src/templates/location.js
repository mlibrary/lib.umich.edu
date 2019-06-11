import React from 'react'
import { graphql } from "gatsby"

import Layout from "../components/layout"
import PageHeader from '../components/page-header'

export default function({ data }) {
  const {
    title,
    body,
    fields,
    relationships
  } = data.page

  console.log('relationships', relationships)

  return (
    <Layout>
      <PageHeader
        title={title}
        summary={body.summary}
        breadcrumb={fields.breadcrumb}
        imageData={relationships.field_image[0].localFile.childImageSharp.fluid}
      />
    </Layout>
  )

}

export const query = graphql`
  query($slug: String! ) {
    page: nodeBuilding(fields: { slug: { eq: $slug } }) {
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
        field_image {
          localFile {
            childImageSharp {
              fluid(quality: 90, maxWidth: 1280) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`