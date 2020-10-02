import { useStaticQuery, graphql } from 'gatsby'
import React from 'react'
import { SPACING, MEDIA_QUERIES, Heading, Margins } from '@umich-lib/core'
import Link from '../link'
import EventCard from '../event-card'
import { sortEventsByStartDate } from '../../utils/events'

/*
  Featured and latest news and exhibits.
  
  "What's happening?"

  look at all kinds of events that are prioritized,
  use those, then if we need more add in some
  non prioritized events (except don't use Exhibits).
  Make sure we use up to 3, but no more.
  Sort all of em by date.
*/
export default function WhatsHappening() {
  const data = useStaticQuery(graphql`
    query {
      priorityEvents: allNodeEventsAndExhibits(
        filter: {
          field_priority_for_homepage: { eq: true }
          relationships: {
            field_design_template: {
              field_machine_name: { eq: "event_exhibit" }
            }
          }
        }
      ) {
        nodes {
          ...eventFragment
        }
      }
      otherEvents: allNodeEventsAndExhibits(
        filter: {
          relationships: {
            field_design_template: {
              field_machine_name: { eq: "event_exhibit" }
            }
            field_event_type: { name: { ne: "Exhibit" } }
          }
        }
      ) {
        nodes {
          ...eventFragment
        }
      }
    }
  `)

  // Join exhibits with events, but only keep 3.
  const joinedEvents = sortEventsByStartDate({
    events: data.priorityEvents.nodes,
    onlyAfterToday: true,
  })
    .concat(
      sortEventsByStartDate({
        events: data.otherEvents.nodes,
        onlyAfterToday: true,
      })
    )
    .slice(0, 3)

  const events = sortEventsByStartDate({
    events: joinedEvents,
  })

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
            [MEDIA_QUERIES.LARGESCREEN]: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gridGap: `${SPACING['XL']} ${SPACING['M']}`,
            },
          }}
        >
          {events.map(event => (
            <EventCard {...event} displayImage={false} hasBorder={false} />
          ))}
        </div>

        <Link to="/visit-and-study/events-and-exhibits/today-and-upcoming">
          View all events
        </Link>
      </Margins>
    </div>
  )
}
