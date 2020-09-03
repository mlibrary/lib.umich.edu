import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Margins, Heading, SPACING } from '@umich-lib/core'
import Link from '../link'

export default function EventsAndExhibitsPanel() {
  const data = useStaticQuery(graphql`
    query {
      events: allNodeEventsAndExhibits(sort: { fields: created, order: DESC }) {
        edges {
          node {
            ...eventFragment
          }
        }
      }
    }
  `)

  // Flatten things a bit.
  const events = data.events.edges.map(({ node }) => node)

  return (
    <Margins>
      <Heading
        level="2"
        size="L"
        css={{
          marginBottom: SPACING['L'],
        }}
      >
        Events
      </Heading>

      <p
        css={{
          marginBottom: SPACING['L'],
        }}
      >
        [This page is in development....]
      </p>

      {events.map(event => (
        <Event {...event} />
      ))}
    </Margins>
  )
}

function Event({ title, fields }) {
  return (
    <React.Fragment>
      <h2
        css={{
          paddingBottom: SPACING['L'],
        }}
      >
        <Link kind="description" to={fields.slug}>
          {title}
        </Link>
      </h2>
    </React.Fragment>
  )
}
