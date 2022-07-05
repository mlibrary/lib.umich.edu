import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import SearchEngineOptimization from '../components/seo';
import Panels from '../components/panels';

function HomePageTemplate({ data }) {
  const { drupal_internal__nid, relationships, body } = data.page;
  const description = body && body.summary ? body.summary : null;

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SearchEngineOptimization description={description} />
      <span className='visually-hidden'>
        <h1>Home page</h1>
      </span>
      <Panels data={relationships.field_panels} />
    </Layout>
  );
}

export default HomePageTemplate;

export const query = graphql`
  query ($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
  }
`;
