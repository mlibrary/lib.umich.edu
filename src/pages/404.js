import React from 'react'
import Layout from '../components/layout'

import {
  Heading,
  Text,
  SPACING,
  Margins,
  COLORS
} from '@umich-lib/core'
import SEO from '../components/seo'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404" />
    <Margins css={{
      marginTop: SPACING['4XL'],
      marginBottom: SPACING['4XL'],
    }}>
      <Heading size="3XL" level="1" css={{ marginBottom: SPACING['M'] }}><span
        css={{
          fontSize: '60%',
          display: 'block',
          color: COLORS.orange['400']
        }}>404</span>Page not found</Heading>
      <Text lede>We are unable to find this page.</Text>
    </Margins>
  </Layout>
)

export default NotFoundPage
