import { Heading, Margins, SPACING, Text } from '../reusable';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import ChatIframe from '../components/chat-iframe';
import DestinationLocationInfo from '../components/destination-location-info';
import { GatsbyImage } from 'gatsby-plugin-image';
import getNode from '../utils/get-node';
import { graphql } from 'gatsby';
import Html from '../components/html';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import TemplateLayout from './template-layout';

const DestinationTemplate = ({ data }) => {
  const node = getNode(data);
  const { field_title_context: fieldTitleContext, fields, body, relationships } = node;
  const showChatIframe = fields?.slug === '/ask-librarian';
  const imageData
    = relationships?.field_media_image?.relationships?.field_media_image
      ?.localFile?.childImageSharp?.gatsbyImageData;

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          level={1}
          size='3XL'
          css={{
            marginBottom: SPACING.L,
            marginTop: SPACING.S
          }}
        >
          {fieldTitleContext}
        </Heading>
      </Margins>
      <Template asideWidth='26rem'>
        <TemplateContent>
          <div
            css={{
              maxWidth: '38rem'
            }}
          >
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

            <DestinationLocationInfo node={node} />
          </div>

          {body && <Html html={body.processed} />}

          <Panels data={relationships.field_panels} />
        </TemplateContent>
        <TemplateSide
          css={{
            '> div': {
              border: 'none',
              maxWidth: '38rem',
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
              alt=''
            />
          )}

          {showChatIframe && <ChatIframe />}
        </TemplateSide>
      </Template>
    </TemplateLayout>
  );
};

DestinationTemplate.propTypes = {
  data: PropTypes.any
};

export default DestinationTemplate;

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
