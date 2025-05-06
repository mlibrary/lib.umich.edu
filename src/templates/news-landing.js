import { Expandable, ExpandableButton, ExpandableChildren, Heading, Margins, SPACING } from '../reusable';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import Card from '../components/card';
import { graphql } from 'gatsby';
import Html from '../components/html';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';

const processNewsData = (data) => {
  if (!data) {
    return [];
  }

  return data.edges.map(({ node }) => {
    const { title, created, body, relationships, fields } = node;
    const image
      = relationships?.field_media_image?.relationships?.field_media_image
        ?.localFile?.childImageSharp?.gatsbyImageData;
    const subtitle = new Date(created).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return {
      description: body?.summary,
      href: fields.slug,
      image,
      subtitle,
      title
    };
  });
};

const NewsLandingTemplate = ({ data }) => {
  const newsLibraryUpdates = processNewsData(data.newsLibraryUpdates);
  const newsLibraryUpdatesInitialShow = 20;
  const { body, fields, drupal_internal__nid: drupalInternalNID } = data.page;

  return (
    <Layout drupalNid={drupalInternalNID}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size='3XL'
          level={1}
          css={{
            marginBottom: SPACING.L
          }}
        >
          New DS Packages - Release and Testing
        </Heading>
      </Margins>
      <Template>
        <TemplateContent>
          {body && (
            <div css={{ marginBottom: SPACING.XL }}>
              <Heading level={2} size='L'>m-banner</Heading>
              <m-banner variant='info'></m-banner>
              <m-banner variant='warning'></m-banner>
              <m-banner>No variant specified</m-banner>
              <m-banner>With a <a href='#'>link</a></m-banner>

              <Heading level={2} size='L'css={{ marginTop: SPACING.L }}>m-callout</Heading>
              <m-callout variant='success' label='This is the success content. This should also be dismissable.' dismissible></m-callout>
              <m-callout variant='warning' label='This is the warning content.'></m-callout>
              <m-callout variant='critical' label='This is the critical content.'></m-callout>
              <m-callout variant='info' label='This is the info content.'></m-callout>
            </div>
          )}
        </TemplateContent>

        <TemplateSide>
          <Heading
            size='L'
            level={2}
            css={{
              marginBottom: SPACING.L
            }}
          >
            Library Updates
          </Heading>
          {newsLibraryUpdates && (
            <Expandable>
              <ol>
                <ExpandableChildren show={newsLibraryUpdatesInitialShow}>
                  {newsLibraryUpdates.map((item, index) => {
                    return (
                      <li
                        key={`news-item-${index}`}
                        css={{
                          marginBottom: SPACING.XL
                        }}
                      >
                        <Card
                          href={item.href}
                          title={item.title}
                          subtitle={item.subtitle}
                        />
                      </li>
                    );
                  })}
                </ExpandableChildren>
              </ol>

              {newsLibraryUpdates.length > newsLibraryUpdatesInitialShow && (
                <ExpandableButton
                  name='updates'
                  count={newsLibraryUpdates.length}
                />
              )}
            </Expandable>
          )}
        </TemplateSide>
      </Template>
    </Layout>
  );
};

NewsLandingTemplate.propTypes = {
  data: PropTypes.object
};

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={data.page} />;
};
/* eslint-enable react/prop-types */

export default NewsLandingTemplate;

const query = graphql`
  query ($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    featuredNews: allNodeNews(
      filter: {
        field_news_type: { eq: "news_main" }
        field_featured_news_item: { eq: true }
      }
      sort: {created: DESC}
    ) {
      edges {
        node {
          ...newsFragment
        }
      }
    }
    restNews: allNodeNews(
      filter: {
        field_news_type: { eq: "news_main" }
        field_featured_news_item: { eq: false }
      }
      sort: {created: DESC}
    ) {
      edges {
        node {
          ...newsFragment
        }
      }
    }
    newsLibraryUpdates: allNodeNews(
      filter: {
        field_news_type: { eq: "library_updates" }
        relationships: {
          field_design_template: { field_machine_name: { eq: "news" } }
        }
      }
      sort: {created: DESC}
    ) {
      edges {
        node {
          ...newsFragment
        }
      }
    }
  }
`;

export { query };
