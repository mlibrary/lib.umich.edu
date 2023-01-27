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
  return <SearchEngineOptimization data={ node } />;
}
