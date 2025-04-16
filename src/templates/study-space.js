import { Heading, Margins, MEDIA_QUERIES, SPACING, Text } from '../reusable';
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
        <header
          css={{
            [MEDIA_QUERIES.S]: {
              alignItems: 'stretch',
              display: 'flex',
              flexDirection: 'row',
              minHeight: '350px'
            },
            flexDirection: 'column-reverse',
            marginBottom: SPACING['3XL']
          }}
        >
          {imageData && (
            <GatsbyImage
              image={imageData}
              css={{
                flex: '0 1 50%',
                margin: `0 -${SPACING.M}`,
                [MEDIA_QUERIES.S]: {
                  'div:first-child > img': {
                    position: 'absolute !important'
                  },
                  margin: 0,
                  maxWidth: '450px'
                }
              }}
              alt={imageAlt}
            />
          )}
          <div
            css={{
              [MEDIA_QUERIES.S]: {
                flex: '1 1 0',
                marginLeft: '1rem',
                marginTop: '0',
                paddingLeft: '1rem'
              },
              marginTop: SPACING.L
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
        </header>

      </Margins>
      <Template asideWidth='50rem' contentSide='right'>
        <TemplateSide
          contentSide='right'
        >
          <LocationAside
            css={{
              [MEDIA_QUERIES.S]: {
                marginBottom: 0
              }
            }}
            node={node}
            isStudySpaceAside={true}
          />
        </TemplateSide>
        <TemplateContent css={{
          [MEDIA_QUERIES.M]: {
            marginLeft: SPACING['3XL']
          }
        }}
        >
          {body && <Html html={body.processed} />}
        </TemplateContent>
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
