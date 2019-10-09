import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Panels from '../components/panels'

function BasicTemplate({ data, ...rest }) {
  const {
    drupal_internal__nid,
    relationships,
  } = data.page

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO />
      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export default BasicTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
  }
`
