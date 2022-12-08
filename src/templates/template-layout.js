import React from 'react';

import Layout from '../components/layout';
import SearchEngineOptimization from '../components/seo';

export default function TemplateLayout({ node, children, ...rest }) {
  return (
    <Layout drupalNid={node.drupal_internal__nid} {...rest}>
      {children}
    </Layout>
  );
}

export function Head({ node }) {
  const { title, field_seo_keywords, body } = node;
  const description = body && body.summary ? body.summary : null;
  const keywords = field_seo_keywords ? field_seo_keywords.split(', ') : [];
  return (
    <SearchEngineOptimization
      title={title}
      keywords={keywords}
      description={description}
    />
  );
}
