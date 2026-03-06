import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';

export default function TemplateLayout ({ node, children, ...rest }) {
  return (
    <Layout drupalNid={node.drupal_internal__nid} {...rest}>
      {children}
    </Layout>
  );
}

TemplateLayout.propTypes = {
  children: PropTypes.any,
  node: PropTypes.shape({
    // eslint-disable-next-line camelcase
    drupal_internal__nid: PropTypes.any
  })
};

/* eslint-disable react/prop-types */
export const Head = ({ node, location }) => {
  return <SearchEngineOptimization data={node} location={location} />;
};
/* eslint-enable react/prop-types */
