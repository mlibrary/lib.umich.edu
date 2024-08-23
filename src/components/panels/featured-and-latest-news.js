import { COLORS, Heading, Margins, MEDIA_QUERIES, SPACING } from '../../reusable';
import { graphql, useStaticQuery } from 'gatsby';
import Card from '../card';
import Link from '../link';
import React from 'react';
import styled from '@emotion/styled';

const processNewsNodeForCard = ({ newsNode }) => {
  const newsImage
    = newsNode.relationships?.field_media_image?.relationships?.field_media_image
      ?.localFile?.childImageSharp?.gatsbyImageData;

  const children = newsNode.body?.summary;

  return {
    children,
    href: newsNode.fields.slug,
    image: newsImage,
    subtitle: new Date(newsNode.created).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    title: newsNode.title
  };
};

/*
 *Experimenting with this layout system.
 */
const Layout = styled.div({
  display: 'grid',
  gridGap: SPACING.S,
  gridTemplateColumns: `
    [content-start] repeat(11, 1fr)
    1fr [content-end]
  `,
  [MEDIA_QUERIES.LARGESCREEN]: {
    gridGap: SPACING.L
  }
});

const sortNews = ({ data }) => {
  const priorityNewsCount = data.priorityNews.edges.length;

  // If there is no priority news, just send back recent news.
  if (priorityNewsCount === 0) {
    return data.recentNews;
  }

  // Otherwise, merge the two, sort by date.
  const recentNewsSliced = data.recentNews.edges.slice(
    0,
    5 - priorityNewsCount
  );
  const allNews = data.priorityNews.edges.concat(recentNewsSliced);

  const compareCreatedDate = (compareA, compareB) => {
    if (Date.parse(compareA.node.created) < Date.parse(compareB.node.created)) {
      return 1;
    }

    if (Date.parse(compareA.node.created) > Date.parse(compareB.node.created)) {
      return -1;
    }

    return 0;
  };

  const sorted = [...allNews].sort(compareCreatedDate);

  return sorted;
};

export default function FeaturedAndLatestNews () {
  const data = useStaticQuery(graphql`
    query {
      featuredNews: allNodeNews(
        filter: { field_featured_news_item: { eq: true } }
        sort: {created: DESC}
        limit: 1
      ) {
        edges {
          node {
            ...newsFragment
          }
        }
      }
      priorityNews: allNodeNews(
        filter: {
          field_priority_for_homepage: { eq: true }
          field_featured_news_item: { eq: false }
        }
        sort: {created: DESC}
        limit: 5
      ) {
        edges {
          node {
            ...newsFragment
          }
        }
      }
      recentNews: allNodeNews(
        filter: {
          field_priority_for_homepage: { eq: false }
          field_featured_news_item: { eq: false }
        }
        sort: {created: DESC}
        limit: 5
      ) {
        edges {
          node {
            ...newsFragment
          }
        }
      }
      newsLandingPage: nodePage(
        relationships: {
          field_design_template: { field_machine_name: { eq: "news_landing" } }
        }
      ) {
        fields {
          slug
        }
      }
    }
  `);

  if (data.featuredNews.edges.length === 0) {
    throw new Error(`
      Unexpected data!

      The homepage requires at least one news node
      that is featured for the homepage.
    `);
  }

  const featureNode = data.featuredNews.edges[0].node;
  const featureCardProps = processNewsNodeForCard({ newsNode: featureNode });
  const recentNews = sortNews({ data });
  const recentNewsCardProps = recentNews.map(({ node }) => {
    return processNewsNodeForCard({ newsNode: node });
  });
  const viewAllNewsHref = data.newsLandingPage.fields.slug;

  return (
    <Margins>
      <Layout
        css={{
          margin: `${SPACING['3XL']} 0`
        }}
      >
        <div
          css={{
            gridColumn: 'content-start / content-end',
            [MEDIA_QUERIES.LARGESCREEN]: {
              gridColumn: 'content-start / span 6'
            }
          }}
        >
          <Heading
            level={2}
            size='M'
            css={{
              marginBottom: SPACING.L
            }}
          >
            Feature
          </Heading>
          <div
            css={{
              [MEDIA_QUERIES.LARGESCREEN]: {
                borderRight: `solid 1px var(--colors-neutral-100)`,
                paddingRight: SPACING.XL
              }
            }}
          >
            <Card
              title={featureCardProps.title}
              subtitle={featureCardProps.subtitle}
              href={featureCardProps.href}
              image={featureCardProps.image}
            >
              {featureCardProps.children}
            </Card>
          </div>
        </div>

        <div
          css={{
            gridColumn: 'content-start / content-end',
            [MEDIA_QUERIES.LARGESCREEN]: {
              gridColumn: 'span 6'
            }
          }}
        >
          <Heading
            level={2}
            size='M'
            css={{
              marginBottom: SPACING.L,
              marginTop: SPACING.XL,
              [MEDIA_QUERIES.LARGESCREEN]: {
                marginTop: 0
              }
            }}
          >
            Recent news
          </Heading>

          <ol
            css={{
              '> li': {
                marginBottom: SPACING.XL
              }
            }}
          >
            {recentNewsCardProps.map(({ title, subtitle, href }, item) => {
              return (
                <li key={item + href}>
                  <Card title={title} subtitle={subtitle} href={href} />
                </li>
              );
            })}
          </ol>

          <Link to={viewAllNewsHref}>View all news and stories</Link>
        </div>
      </Layout>
    </Margins>
  );
}
