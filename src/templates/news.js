import React, { useState, useEffect } from 'react';
import SearchEngineOptimization from '../components/seo';
import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Margins, Heading, SPACING, COLORS, Text, TYPOGRAPHY } from '../reusable';
import { Template, TemplateSide, TemplateContent } from '../components/aside-layout';
import TemplateLayout from './template-layout';
import Panels from '../components/panels';
import Html from '../components/html';
import Breadcrumb from '../components/breadcrumb';
import getNode from '../utils/get-node';
import transformNodePanels from '../utils/transform-node-panels';
import Link from '../components/link';
import Share from '../components/share';
import PropTypes from 'prop-types';

function NewsTemplate ({ data }) {
  const node = getNode(data);
  const { bodyPanels, fullPanels } = transformNodePanels({ node });
  const { field_title_context: fieldTitleContext, body, fields, relationships, created } = node;
  const { slug } = fields;

  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image;
  const imageData = image
    ? image.localFile.childImageSharp.gatsbyImageData
    : null;
  const imageCaption =
    relationships.field_media_image &&
    relationships.field_media_image.field_image_caption
      ? relationships.field_media_image.field_image_caption.processed
      : null;

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
      </Margins>
      <Template asideWidth='25rem'>
        <TemplateContent>
          <Heading
            level={1}
            size='3XL'
            css={{
              marginTop: SPACING.S,
              marginBottom: SPACING.XL
            }}
          >
            {fieldTitleContext}
            {created && (
              <p
                css={{
                  ...TYPOGRAPHY['2XS'],
                  color: COLORS.neutral['300'],
                  fontFamily: 'Muli',
                  paddingTop: SPACING.M
                }}
              >
                {new Date(created).toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'America/New_York'
                })}
              </p>
            )}
          </Heading>
          {body && <Html html={body.processed} />}
          {bodyPanels && <Panels data={bodyPanels} />}
        </TemplateContent>
        <TemplateSide
          css={{
            '> div': {
              border: 'none'
            }
          }}
        >
          {imageData && (
            <figure
              css={{
                maxWidth: '38rem',
                marginBottom: SPACING.XL
              }}
            >
              <GatsbyImage
                image={imageData}
                css={{
                  width: '100%',
                  borderRadius: '2px'
                }}
                alt=''
              />
              {imageCaption && (
                <figcaption
                  css={{
                    paddingTop: SPACING.S,
                    color: COLORS.neutral['300']
                  }}
                >
                  <Html
                    html={
                      relationships.field_media_image.field_image_caption
                        .processed
                    }
                  />
                </figcaption>
              )}
            </figure>
          )}

          <Share
            url={'https://www.lib.umich.edu' + slug}
            title={fieldTitleContext}
          />
          <StayInTheKnow />
        </TemplateSide>
      </Template>

      <Panels data={fullPanels} />
    </TemplateLayout>
  );
}

NewsTemplate.propTypes = {
  data: PropTypes.object
};

/* eslint-disable react/prop-types */
export function Head ({ data }) {
  return <SearchEngineOptimization data={getNode(data)} />;
}
/* eslint-enable react/prop-types */

export default NewsTemplate;

function StayInTheKnow () {
  const newsEmailSignUpURL =
    'https://visitor.r20.constantcontact.com/manage/optin?v=001cDYOOus5TIdow4bzSVycvvOQHeBTvaw-u-NrxVEBWd7CK3DPmM7o6fTauJmkB-PmyMdNV2isg8l8Y3gsqV07er-4bFAo3fZNo1cYkbzohp4%3D';

  return (
    <>
      <Heading
        level={2}
        size='2XS'
        css={{
          marginTop: SPACING.L,
          paddingTop: SPACING.L,
          borderTop: `solid 1px ${COLORS.neutral['100']}`,
          fontWeight: '600'
        }}
      >
        Stay in the know
      </Heading>
      <Text>
        {' '}
        <Link
          to={newsEmailSignUpURL}
          css={{
            display: 'inline-block'
          }}
        >
          Sign up for email updates
        </Link>{' '}
      </Text>
    </>
  );
}

export const query = graphql`
  query ($slug: String!) {
    news: nodeNews(fields: { slug: { eq: $slug } }) {
      ...newsFragment
    }
  }
`;
