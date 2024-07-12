/* eslint-disable camelcase */
import { graphql } from 'gatsby';
import Html from '../components/html';
import Layout from '../components/layout';
import { Margins } from '../reusable';
import PageHeader from '../components/page-header';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import transformNodePanels from '../utils/transform-node-panels';

export default function LandingTemplate ({ data }) {
  const node = data.page;
  const {
    field_title_context,
    body,
    fields,
    relationships,
    drupal_internal__nid
  } = node;
  const { bodyPanels, fullPanels } = transformNodePanels({ node });

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <PageHeader
        breadcrumb={fields.breadcrumb}
        title={field_title_context}
        summary={body ? body.summary : null}
        image={
          relationships.field_media_image
          && relationships.field_media_image.relationships.field_media_image
        }
      />
      <Margins>
        {body && <Html html={body.processed} />} <Panels data={bodyPanels} />
      </Margins>
      <Panels data={fullPanels} />
    </Layout>
  );
}

LandingTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.shape({
      body: PropTypes.shape({
        processed: PropTypes.any,
        summary: PropTypes.any
      }),
      drupal_internal__nid: PropTypes.any,
      field_title_context: PropTypes.any,
      fields: PropTypes.shape({
        breadcrumb: PropTypes.any
      }),
      relationships: PropTypes.shape({
        field_media_image: PropTypes.shape({
          relationships: PropTypes.shape({
            field_media_image: PropTypes.any
          })
        })
      })
    })
  })
};

export const Head = ({ data }) => {
  return <SearchEngineOptimization data={data.page} />;
};

Head.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.any
  })
};

export const query = graphql`
  query ($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    parents: allNodePage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          title
          drupal_id
          fields {
            slug
          }
        }
      }
    }
  }
`;
