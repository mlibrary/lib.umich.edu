import React from 'react'
import Layout from '../components/layout'

import {
  Heading,
  Text,
  SPACING,
  Margins,
} from '@umich-lib/core'
import SEO from '../components/seo'

export default function PlaceholderSearchResultsPage() {
  return (
    <Layout>
      <SEO title="Search results" />
      <Margins css={{
        marginTop: SPACING['4XL'],
        marginBottom: SPACING['4XL'],
      }}>
        <Heading size="3XL" level="1" css={{ marginBottom: SPACING['M'] }}>Thanks for searching!</Heading>
        <Text lede>We're still figuring out how we want to implement this.</Text>
      </Margins>
    </Layout>
  )
}
