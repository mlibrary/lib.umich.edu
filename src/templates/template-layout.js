import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

export default function TemplateLayout({ node, children, ...rest }) {
  const {
    title,
    drupal_internal__nid,
    field_seo_title,
    field_seo_keywords
  } = node
  const metaTitle = field_seo_title ? field_seo_title : title

  return (
    <Layout drupalNid={drupal_internal__nid} {...rest}>
      <SEO title={metaTitle} keywords={field_seo_keywords} />
      {children}
    </Layout>
  )
}