import { Heading, Margins, SPACING, Text, TYPOGRAPHY } from '../reusable';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import { GatsbyImage } from 'gatsby-plugin-image';
import getNode from '../utils/get-node';
import { graphql } from 'gatsby';
import Html from '../components/html';
import Link from '../components/link';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import Share from '../components/share';
import TemplateLayout from './template-layout';
import transformNodePanels from '../utils/transform-node-panels';

const NewsTemplate = ({ data }) => {
  const node = getNode(data);
  const { bodyPanels, fullPanels } = transformNodePanels({ node });
  const { field_title_context: fieldTitleContext, body, fields, relationships, created } = node;
  const { slug } = fields;

  const image
    = relationships.field_media_image
      && relationships.field_media_image.relationships.field_media_image;
  const imageData = image
    ? image.localFile.childImageSharp.gatsbyImageData
    : null;
  const imageAlt = relationships?.field_media_image?.field_media_image?.alt || '';
  const imageCaption
    = relationships.field_media_image
      && relationships.field_media_image.field_image_caption
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
              marginBottom: SPACING.XL,
              marginTop: SPACING.S
            }}
          >
            {fieldTitleContext}
            {created && (
              <p
                css={{
                  ...TYPOGRAPHY['2XS'],
                  color: 'var(--color-neutral-300)',
                  fontFamily: 'Muli',
                  paddingTop: SPACING.M
                }}
              >
                {new Date(created).toLocaleDateString('en-us', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
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
                marginBottom: SPACING.XL,
                maxWidth: '38rem'
              }}
            >
              <GatsbyImage
                image={imageData}
                css={{
                  borderRadius: '2px',
                  width: '100%'
                }}
                alt={imageAlt}
              />
              {imageCaption && (
                <figcaption
                  css={{
                    color: 'var(--color-neutral-300)',
                    paddingTop: SPACING.S
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
            url={`https://www.lib.umich.edu${slug}`}
            title={fieldTitleContext}
          />
          <StayInTheKnow />
        </TemplateSide>
      </Template>

      <Panels data={fullPanels} />
    </TemplateLayout>
  );
};

NewsTemplate.propTypes = {
  data: PropTypes.object
};

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={getNode(data)} />;
};
/* eslint-enable react/prop-types */

export default NewsTemplate;

const StayInTheKnow = () => {
  const newsEmailSignUpURL
    = 'https://visitor.r20.constantcontact.com/manage/optin?v=001cDYOOus5TIdow4bzSVycvvOQHeBTvaw-u-NrxVEBWd7CK3DPmM7o6fTauJmkB-PmyMdNV2isg8l8Y3gsqV07er-4bFAo3fZNo1cYkbzohp4%3D';

  return (
    <>
      <Heading
        level={2}
        size='2XS'
        css={{
          borderTop: `solid 1px var(--color-neutral-100)`,
          fontWeight: '600',
          marginTop: SPACING.L,
          paddingTop: SPACING.L
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
        </Link>
        {' '}
      </Text>
    </>
  );
};

export const query = graphql`
  query ($slug: String!) {
    news: nodeNews(fields: { slug: { eq: $slug } }) {
      ...newsFragment
    }
  }
`;
