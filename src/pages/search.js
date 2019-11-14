import React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import Img from 'gatsby-image'
import Layout from '../components/layout'

import {
  Heading,
  Text,
  SPACING,
  Margins,
  COLORS
} from '@umich-lib/core'
import SEO from '../components/seo'

export default function PlaceholderSearchResultsPage() {
  const imageData = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "squirrel.png" }) {
        childImageSharp {
          fluid(quality: 80, maxWidth: 1280) {
            ...GatsbyImageSharpFluid_withWebp_noBase64
          }
        }
      }
    }
  `)

  return (
    <Layout>
      <SEO title="Search results" />
      <Margins css={{
        marginTop: SPACING['4XL'],
        marginBottom: SPACING['4XL'],
        textAlign: 'center'
      }}>
        <Img fluid={imageData.file.childImageSharp.fluid} alt="" css={{
          maxWidth: '21rem',
          margin: '0 auto',
          marginBottom: SPACING['L']
        }} />
        <Heading size="3XL" level="1" css={{ marginBottom: SPACING['M'] }}>Thanks for searching!</Heading>
        <Text lede css={{ maxWidth: '100%', color: COLORS.neutral['300'] }}>We're still figuring out how we want to implement this.</Text>
      </Margins>
    </Layout>
  )
}
