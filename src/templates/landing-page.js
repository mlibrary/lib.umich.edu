import React from 'react'
import { graphql } from "gatsby"
import {
  Heading,
  Margins
} from '@umich-lib/core'
import Layout from "../components/layout"
import Hero from '../components/hero'

const LandingPageTemplate = ({ data }) => {
  const hero_image = data.nodeLandingPage.relationships.field_hero_image.localFile.childImageSharp.fluid
  const {
    title,
    field_cond_display_title
  } = data.nodeLandingPage
  
  return (
    <Layout>
      <Margins css={{ padding: '0 !important' }}>
        <Hero image={hero_image}>
        </Hero>
      </Margins>

      <Margins>
        {field_cond_display_title && (
          <Heading level={1} size="XL">{title}</Heading>
        )}
      </Margins>
      
    </Layout>
  )
}

export default LandingPageTemplate

export const query = graphql`
  query($slug: String!) {
    nodeLandingPage(fields: { slug: { eq: $slug } }) {
      title
      field_cond_display_title
      relationships {
        node__page {
          title
          path {
            alias
          }
        }
        field_hero_image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 1920) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`