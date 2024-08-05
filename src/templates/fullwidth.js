import { Heading, Margins, SPACING } from '../reusable';
import Breadcrumb from '../components/breadcrumb';
import getNode from '../utils/get-node';
import { graphql } from 'gatsby';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import Html from '../components/html';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import TemplateLayout from './template-layout';
import transformNodePanels from '../utils/transform-node-panels';

export default function FullWidthTemplate ({ data, ...rest }) {
  const node = getNode(data);
  const { field_title_context: fieldTitleContext, body, fields } = node;
  const { bodyPanels, fullPanels } = transformNodePanels({ node });

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size='3XL'
          level={1}
          css={{
            marginBottom: fullPanels.length ? '0' : SPACING.XL
          }}
        >
          {fieldTitleContext}
        </Heading>
      </Margins>

      <HorizontalNavigation
        data={data.parents}
        parentOrder={rest.pageContext.parents}
      />

      {body && (
        <Margins
          css={{
            marginBottom: fullPanels.length ? '0' : SPACING['5XL']
          }}
        >
          <Html html={body.processed} />

          <Panels data={bodyPanels} />
        </Margins>
      )}

      <Panels data={fullPanels} />
    </TemplateLayout>
  );
}

FullWidthTemplate.propTypes = {
  data: PropTypes.shape({
    parents: PropTypes.any
  })
};

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={getNode(data)} />;
};
/* eslint-enable react/prop-types */

export const query = graphql`
  query ($slug: String!, $parents: [String]) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    location: nodeLocation(fields: { slug: { eq: $slug } }) {
      ...locationFragment
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
