import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'
import * as moment from 'moment'
import { SPACING, MEDIA_QUERIES, COLORS, Heading } from '@umich-lib/core'
import Card from '../card'
import Link from '../link'

function processNewsNodeForCard({ newsNode }) {
  const newsImage =
    newsNode.relationships?.field_media_image?.relationships?.field_media_image
      ?.localFile?.childImageSharp?.fluid

  const children = newsNode.body?.summary

  return {
    title: newsNode.title,
    subtitle: moment(newsNode.created).format('MMMM D, YYYY'),
    href: newsNode.fields.slug,
    image: newsImage,
    children,
  }
}

/*
  Experimenting with this layout system.
*/
const Layout = styled.div({
  display: 'grid',
  gridTemplateColumns: `
    [site-start] calc(50vw - 39rem)
    [content-start] repeat(11, 1fr)
    1fr [content-end]
    calc(50vw - 39rem) [site-end] 
  `,
  gridGap: SPACING['S'],
  [MEDIA_QUERIES.LARGESCREEN]: {
    gridGap: SPACING['L'],
  },
})

export default function FeaturedAndLatestNews() {
  const data = useStaticQuery(graphql`
    query {
      featuredNews: allNodeNews(
        filter: { field_featured_news_item: { eq: true } }
        sort: { fields: created, order: DESC }
        limit: 1
      ) {
        edges {
          node {
            ...newsFragment
          }
        }
      }
      recentNews: allNodeNews(
        filter: { field_featured_news_item: { eq: false } }
        sort: { fields: created, order: DESC }
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
  `)

  const featureNode = data.featuredNews.edges[0].node
  const featureCardProps = processNewsNodeForCard({ newsNode: featureNode })
  const recentNewsCardProps = data.recentNews.edges.map(({ node }) => {
    return processNewsNodeForCard({ newsNode: node })
  })
  const viewAllNewsHref = data.newsLandingPage.fields.slug

  return (
    <Layout
      css={{
        margin: `${SPACING['3XL']} 0`,
      }}
    >
      <div
        css={{
          gridColumn: 'content-start / content-end',
          [MEDIA_QUERIES.LARGESCREEN]: {
            gridColumn: 'content-start / span 6',
          },
        }}
      >
        <Heading
          level={2}
          size="XL"
          css={{
            marginBottom: SPACING['XL'],
          }}
        >
          Feature
        </Heading>
        <div
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              paddingRight: SPACING['XL'],
              borderRight: `solid 1px ${COLORS.neutral['100']}`,
            },
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
            gridColumn: 'span 6',
          },
        }}
      >
        <Heading
          level={2}
          size="XL"
          css={{
            marginTop: SPACING['XL'],
            marginBottom: SPACING['XL'],
            [MEDIA_QUERIES.LARGESCREEN]: {
              marginTop: 0,
            },
          }}
        >
          Recent news
        </Heading>

        <ol
          css={{
            '> li': {
              marginBottom: SPACING['XL'],
            },
          }}
        >
          {recentNewsCardProps.map(({ title, subtitle, href, children }, i) => (
            <li key={i + href}>
              <Card title={title} subtitle={subtitle} href={href} />
            </li>
          ))}
        </ol>

        <Link to={viewAllNewsHref}>View all news and stories</Link>
      </div>
    </Layout>
  )
}
