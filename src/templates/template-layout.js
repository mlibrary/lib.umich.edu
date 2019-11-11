import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

export default function TemplateLayout({ node, children, ...rest }) {
  const {
    title,
    drupal_internal__nid
  } = node

  return (
    <Layout drupalNid={drupal_internal__nid} {...rest}>
      <SEO title={title} />
      {children}
    </Layout>
  )
}