import React from 'react';
import { graphql } from 'gatsby';
import { Margins, Heading, SPACING, Expandable, ExpandableChildren, ExpandableButton } from '../reusable';
import Layout from '../components/layout';
import SearchEngineOptimization from '../components/seo';
import Html from '../components/html';
import Breadcrumb from '../components/breadcrumb';
import Card from '../components/card';
import { Template, TemplateSide, TemplateContent } from '../components/aside-layout';
import * as moment from 'moment';

export default function NewsLandingTemplate({ data }) {
  const news = processNewsData(data.featuredNews).concat(
    processNewsData(data.restNews)
  );
  const newsLibraryUpdates = processNewsData(data.newsLibraryUpdates);
  const newsMainInitialShow = 10;
  const newsLibraryUpdatesInitialShow = 20;
  const { field_title_context, body, fields, drupal_internal__nid } = data.page;

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['L'],
          }}
        >
          {field_title_context}
        </Heading>
      </Margins>
      <Template>
        <TemplateContent>
          {body && (
            <div css={{ marginBottom: SPACING['XL'] }}>
              <Html html={body.processed} />
            </div>
          )}

          {news && (
            <React.Fragment>
              <span className='visually-hidden'>
                <Heading level={2} size="L">
                  Main news
                </Heading>
              </span>
              <Expandable>
                <ol>
                  <ExpandableChildren show={newsMainInitialShow}>
                    {news.map((item, i) => (
                      <li
                        key={'news-item-' + i}
                        css={{
                          marginBottom: SPACING['L'],
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
                    ))}
                  </ExpandableChildren>
                </ol>

                {news.length > newsMainInitialShow && (
                  <ExpandableButton name="stories" count={news.length} />
                )}
              </Expandable>
            </React.Fragment>
          )}
        </TemplateContent>

        <TemplateSide>
          <Heading
            size="L"
            level={2}
            css={{
              marginBottom: SPACING['L'],
            }}
          >
            Library Updates
          </Heading>
          {newsLibraryUpdates && (
            <Expandable>
              <ol>
                <ExpandableChildren show={newsLibraryUpdatesInitialShow}>
                  {newsLibraryUpdates.map((item, i) => (
                    <li
                      key={'news-item-' + i}
                      css={{
                        marginBottom: SPACING['XL'],
                      }}
                    >
                      <Card
                        href={item.href}
                        title={item.title}
                        subtitle={item.subtitle}
                      />
                    </li>
                  ))}
                </ExpandableChildren>
              </ol>

              {newsLibraryUpdates.length > newsLibraryUpdatesInitialShow && (
                <ExpandableButton
                  name="updates"
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

export function Head({ data }) {
  return <SearchEngineOptimization data={data.page} titleField='title' />;
}

function processNewsData(data) {
  if (!data) {
    return [];
  }

  return data.edges.map(({ node }) => {
    const { title, created, body, relationships, fields } = node;
    const image =
      relationships?.field_media_image?.relationships?.field_media_image
        ?.localFile?.childImageSharp?.gatsbyImageData;

    return {
      title,
      subtitle: moment(created).format('MMMM D, YYYY'),
      description: body?.summary,
      href: fields.slug,
      image,
    };
  });
}

export const query = graphql`
  query ($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    featuredNews: allNodeNews(
      filter: {
        field_news_type: { eq: "news_main" }
        field_featured_news_item: { eq: true }
      }
      sort: { created: DESC }
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
      sort: { created: DESC }
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
      sort: { created: DESC }
    ) {
      edges {
        node {
          ...newsFragment
        }
      }
    }
  }
`;
