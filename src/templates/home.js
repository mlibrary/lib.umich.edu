/* eslint-disable camelcase */
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';

const HomePageTemplate = ({ data }) => {
  const { drupal_internal__nid, relationships } = data.page;

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <span className='visually-hidden'>
        <h1>Home page</h1>
      </span>
      <Panels data={relationships.field_panels} />
    </Layout>
  );
};

HomePageTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.shape({
      drupal_internal__nid: PropTypes.any,
      relationships: PropTypes.shape({
        field_panels: PropTypes.any
      })
    })
  })
};

export default HomePageTemplate;

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={data.page} />;
};
/* eslint-enable react/prop-types */

export const query = graphql`
  query ($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
  }
`;
