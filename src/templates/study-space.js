import { Heading, Margins, SPACING, Text } from '../reusable';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import { GatsbyImage } from 'gatsby-plugin-image';
import getNode from '../utils/get-node';
import { graphql } from 'gatsby';
import Html from '../components/html';
import LocationAside from '../components/location-aside';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import TemplateLayout from './template-layout';

const StudyTemplate = ({ data }) => {
  const node = getNode(data);
  const { field_title_context: fieldTitleContext, fields, body, relationships } = node;
  const imageData
        = relationships?.field_media_image?.relationships?.field_media_image
          ?.localFile?.childImageSharp?.gatsbyImageData;
  const imageAlt = relationships?.field_media_image?.field_media_image?.alt || '';

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <div css={{
          display: 'flex',
          gap: '1rem',
          marginBottom: SPACING['3XL']
        }}
        >
          <div
            css={{
              '> div': {
                border: 'none',
                marginRight: '1rem',
                maxWidth: '35rem',
                paddingLeft: '0'
              }
            }}
          >
            {imageData && (
              <GatsbyImage
                image={imageData}
                css={{
                  borderRadius: '2px',
                  width: '100%'
                }}
                alt={imageAlt}
              />
            )}
          </div>
          <div
            css={{
              marginLeft: '1rem'
            }}
          >
            <Heading
              level={1}
              size='3XL'
              css={{
                marginBottom: SPACING.M
              }}
            >
              {fieldTitleContext}
            </Heading>
            {body && body.summary && (
              <Text
                lede
                css={{
                  marginBottom: SPACING.XL
                }}
              >
                {body.summary}
              </Text>
            )}
          </div>
        </div>
      </Margins>
      <Template asideWidth='50rem'>
        <TemplateContent>
          <LocationAside node={node} isStudySpaceAside={true} />
        </TemplateContent>
        <TemplateSide>
          {body && <Html html={body.processed} />}
        </TemplateSide>
      </Template>
    </TemplateLayout>
  );
};

StudyTemplate.propTypes = {
  data: PropTypes.any
};

export default StudyTemplate;

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={getNode(data)} />;
};
/* eslint-enable react/prop-types */

export const query = graphql`
  query ($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    room: nodeRoom(fields: { slug: { eq: $slug } }) {
      ...roomFragment
    }
    location: nodeLocation(fields: { slug: { eq: $slug } }) {
      ...locationFragment
    }
  }
`;
