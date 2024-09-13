/* eslint-disable camelcase */
import { Heading, Margins, SPACING } from '../reusable';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import { GatsbyImage } from 'gatsby-plugin-image';
import getNode from '../utils/get-node';
import { graphql } from 'gatsby';
import Html from '../components/html';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import TemplateLayout from './template-layout';
import transformNodePanels from '../utils/transform-node-panels';
import UserCard from '../components/user-card';

const processContacts = (userData) => {
  if (!userData) {
    return null;
  }

  const userList = userData.reduce((memo, user) => {
    const {
      name,
      field_user_display_name,
      field_user_work_title,
      field_user_email,
      field_user_phone,
      relationships
    } = user;
    const { field_media_image } = relationships;
    let image = {};

    if (field_media_image && field_media_image) {
      image = {
        alt: field_media_image.field_media_image.alt,
        imageData:
          field_media_image.relationships.field_media_image.localFile
            .childImageSharp.gatsbyImageData
      };
    }

    return memo.concat({
      email: field_user_email,
      image,
      name: field_user_display_name,
      phone: field_user_phone === '000-000-0000' ? null : field_user_phone,
      title: field_user_work_title,
      to: `/users/${name}`,
      uniqname: name
    });
  }, []);

  const userListSorted = userList.sort((sortA, sortB) => {
    const nameA = sortA.name.toUpperCase();
    const nameB = sortB.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  return userListSorted;
};

const CollectingAreaTemplate = ({ data }) => {
  const node = getNode(data);
  const { field_title_context, body, fields, relationships } = node;
  const { bodyPanels, fullPanels } = transformNodePanels({ node });
  const image
    = relationships.field_media_image
    && relationships.field_media_image.relationships.field_media_image;
  const imageAlt = relationships.field_media_image?.field_media_image?.alt;
  const imageData = image
    ? image.localFile.childImageSharp.gatsbyImageData
    : null;
  const imageCaption
    = relationships.field_media_image
    && relationships.field_media_image.field_image_caption
      ? relationships.field_media_image.field_image_caption.processed
      : null;
  const contacts = processContacts(
    relationships.field_collecting_area.relationships.user__user
  );

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
              marginBottom: SPACING.L,
              marginTop: SPACING.S
            }}
          >
            {field_title_context}
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
                    borderBottom: `solid 1px var(--color-neutral-100)`,
                    color: 'var(--color-neutral-300)',
                    marginBottom: SPACING.XL,
                    paddingBottom: SPACING.XL,
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

          {contacts && (
            <React.Fragment>
              <Heading
                level={2}
                size='M'
                css={{
                  marginTop: SPACING.XL
                }}
              >
                Contact
              </Heading>
              {contacts.map((contact) => {
                return (
                  <UserCard key={contact.uniqname} {...contact} />
                );
              })}
            </React.Fragment>
          )}
        </TemplateSide>
      </Template>

      <Panels data={fullPanels} />
    </TemplateLayout>
  );
};

CollectingAreaTemplate.propTypes = {
  data: PropTypes.any
};

export default CollectingAreaTemplate;

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
  }
`;
