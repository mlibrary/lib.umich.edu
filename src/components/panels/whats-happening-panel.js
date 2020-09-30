import { useStaticQuery, graphql } from 'gatsby'
import React, { useState, useEffect } from 'react'
import {
  SPACING,
  MEDIA_QUERIES,
  COLORS,
  Heading,
  Margins,
} from '@umich-lib/core'
import Link from '../link'
import Card from '../card'

/*
  Featured and latest news and exhibits.
  
  "What's happening?"
*/
export default function WhatsHappening() {
  const data = useStaticQuery(graphql`
    query {
      events: allNodeEventsAndExhibits {
        edges {
          node {
            ...eventFragment
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

  const viewAllNewsHref = data.newsLandingPage.fields.slug

  const news = [
    {
      title: 'Title',
      subtitle: 'Sub title',
      href: '/',
      children: <p>Children!</p>,
    },
    {
      title: 'Title 2',
      subtitle: 'Sub title',
      href: '/',
      children: <p>Children!</p>,
    },
    {
      title: 'Title 3',
      subtitle: 'Sub title',
      href: '/',
      children: <p>Children!</p>,
    },
  ]

  return (
    <div
      css={{
        marginTop: SPACING['3XL'],
        marginBottom: SPACING['3XL'],
      }}
    >
      <Margins>
        <Heading level={2} size="L">
          What's happening?
        </Heading>

        <div
          css={{
            marginTop: SPACING['L'],
            marginBottom: SPACING['L'],
            [MEDIA_QUERIES.LARGESCREEN]: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gridGap: `${SPACING['XL']} ${SPACING['M']}`,
            },
          }}
        >
          {news.map(newsItemMeta => (
            <Card {...newsItemMeta} />
          ))}
        </div>

        <Link to={viewAllNewsHref}>View all events</Link>
      </Margins>
    </div>
  )
}
