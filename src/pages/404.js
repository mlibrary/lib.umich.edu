import React from 'react'
import Layout from '../components/layout'

import {
  Heading,
  Text
} from '@umich-lib/core'

const NotFoundPage = () => (
  <Layout>
    <Heading size="3XL" level="1">Page not found</Heading>
    <Text>We are unable to find this page.</Text>
  </Layout>
)

export default NotFoundPage
