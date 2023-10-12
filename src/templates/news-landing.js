import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { Margins, Heading, SPACING, Expandable, ExpandableChildren, ExpandableButton } from '../reusable';
import Layout from '../components/layout';
import SearchEngineOptimization from '../components/seo';
import Html from '../components/html';
import Breadcrumb from '../components/breadcrumb';
import Card from '../components/card';
import { Template, TemplateSide, TemplateContent } from '../components/aside-layout';
import PropTypes from 'prop-types';

function NewsLandingTemplate ({ data }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);
  const news = processNewsData(data.featuredNews, initialized).concat(
    processNewsData(data.restNews)
  );
  const newsLibraryUpdates = processNewsData(data.newsLibraryUpdates, initialized);
  const newsMainInitialShow = 10;
  const newsLibraryUpdatesInitialShow = 20;
  const { field_title_context: fieldTitleContext, body, fields, drupal_internal__nid: drupalInternalNID } = data.page;

  if (!initialized) {
    return null;
  }

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
          {fieldTitleContext}
        </Heading>
      </Margins>
      <Template>
        <TemplateContent>
          {body && (
            <div css={{ marginBottom: SPACING.XL }}>
              <Html html={body.processed} />
            </div>
          )}

          {news && (
            <>
              <span className='visually-hidden'>
                <Heading level={2} size='L'>
                  Main news
                </Heading>
              </span>
              <Expandable>
                <ol>
                  <ExpandableChildren show={newsMainInitialShow}>
                    {news.map((item, i) => {
                      return (
                        <li
                          key={'news-item-' + i}
                          css={{
                            marginBottom: SPACING.L
                          }}
                        >
                          <Card
                            href={item.href}
                            title={item.title}
                            subtitle={item.subtitle}
                            image={item.image}
                            horizontal
                          >
                            {item.description}
                          </Card>
                        </li>
                      );
                    })}
                  </ExpandableChildren>
                </ol>

                {news.length > newsMainInitialShow && (
                  <ExpandableButton name='stories' count={news.length} />
                )}
              </Expandable>
            </>
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
                  {newsLibraryUpdates.map((item, i) => {
                    return (
                      <li
                        key={'news-item-' + i}
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
}

NewsLandingTemplate.propTypes = {
  data: PropTypes.object
};

/* eslint-disable react/prop-types */
export function Head ({ data }) {
  return <SearchEngineOptimization data={data.page} />;
}
/* eslint-enable react/prop-types */

export default NewsLandingTemplate;

function processNewsData (data) {
  if (!data) {
    return [];
  }

  return data.edges.map(({ node }) => {
    const { title, created, body, relationships, fields } = node;
    const image =
      relationships?.field_media_image?.relationships?.field_media_image
        ?.localFile?.childImageSharp?.gatsbyImageData;
    const subtitle = new Date(created).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      title,
      subtitle,
      description: body?.summary,
      href: fields.slug,
      image
    };
  });
}

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
