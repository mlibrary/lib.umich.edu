import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Margins, Heading, SPACING, COLORS, TYPOGRAPHY } from '@umich-lib/core'
import CardImage from '../../maybe-design-system/card-image'
import MEDIA_QUERIES from '../../maybe-design-system/media-queries'
import * as moment from 'moment'
import Link from '../link'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../../components/aside-layout'

const exhibitTypes = ['Exhibit', 'Exhibition']

export default function EventsAndExhibitsPanel() {
  /*
    Potential states for today, upcoming, and exhibits:
    
    - null: means "loading", we need to figure this all out client side.
    - []: An empty array will mean no events.
    - [{...}, {...}, ...]: An array of events, means we have some! 
  */
  const [events, setEvents] = useState(null)
  const [todaysEvents, setTodaysEvents] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState(null)
  const [exhibits, setExhibits] = useState(null)

  const data = useStaticQuery(graphql`
    query {
      events: allNodeEventsAndExhibits {
        edges {
          node {
            ...eventFragment
          }
        }
      }
    }
  `)

  useEffect(() => {
    /*
      As this page is setup on the client,
      prepare all events.
    */
    if (events === null) {
      // Flatten things a bit.
      const events = data.events.edges.map(({ node }) => node)

      setEvents(sortEventsByStartDate({ events }))
    }

    // Only process todaysEvents if it hasn't been done already.
    if (events && todaysEvents === null) {
      // useEffects are only client side, so we can use now here.
      const now = moment()

      // Get Today's events.
      const todaysEvents = events.filter(event => {
        const start = event.field_event_date_s_[0].value
        const type = event.relationships.field_event_type.name

        // We don't want exhibits in the events area.
        if (exhibitTypes.includes(type)) {
          return false
        }

        return now.isSame(start, 'day') // all today.
      })

      setTodaysEvents(todaysEvents)
    }

    if (events && upcomingEvents === null) {
      // useEffects are only client side, so we can use now here.
      const now = moment()

      // Get upcoming events.
      // This is repetative... but :shrug:
      const upcomingEvents = events.filter(event => {
        const start = event.field_event_date_s_[0].value
        const type = event.relationships.field_event_type.name

        // We don't want exhibits in the events area.
        if (exhibitTypes.includes(type)) {
          return false
        }

        return now.isBefore(start, 'day') // all after today.
      })

      setUpcomingEvents(upcomingEvents)
    }

    if (events && exhibits === null) {
      const exhibits = events.filter(event => {
        const type = event.relationships.field_event_type.name

        // We don't want exhibits in the events area.
        return exhibitTypes.includes(type)
      })

      setExhibits(exhibits)
    }
  }, [events])

  return (
    <Template>
      <TemplateContent>
        <Heading
          level="2"
          size="L"
          css={{
            marginBottom: SPACING['M'],
          }}
        >
          Today's Events
        </Heading>

        <TodaysEvents events={todaysEvents} />

        <Heading
          level="2"
          size="L"
          css={{
            marginBottom: SPACING['M'],
          }}
        >
          Upcoming Events
        </Heading>

        <UpcomingEvents events={upcomingEvents} />
      </TemplateContent>

      <TemplateSide
        css={{
          '> *:first-child': {
            border: 'none',
          },
        }}
      >
        <div
          css={{
            background: COLORS.blue['100'],
            borderRadius: '4px',
            padding: SPACING['M'],
          }}
        >
          <Heading
            level="2"
            size="L"
            css={{
              marginBottom: SPACING['M'],
            }}
          >
            Exhibits
          </Heading>

          <ExhibitEvents events={exhibits} />
        </div>
      </TemplateSide>
    </Template>
  )
}

function TodaysEvents({ events }) {
  if (Array.isArray(events)) {
    if (events.length === 0) {
      return (
        <p
          css={{
            marginBottom: SPACING['2XL'],
          }}
        >
          There are no events scheduled today.
        </p>
      )
    }

    if (events.length > 0) {
      return <p>Events!</p>
    }
  }

  return null
}

function UpcomingEvents({ events }) {
  if (Array.isArray(events)) {
    if (events.length === 0) {
      return (
        <p
          css={{
            marginBottom: SPACING['2XL'],
          }}
        >
          There are no upcoming events.
        </p>
      )
    }

    if (events.length > 0) {
      return events.map(event => <EventCard {...event} />)
    }
  }

  return null
}

function ExhibitEvents({ events }) {
  if (Array.isArray(events)) {
    if (events.length === 0) {
      return (
        <p
          css={{
            marginBottom: SPACING['2XL'],
          }}
        >
          There are no upcoming exhibits.
        </p>
      )
    }

    if (events.length > 0) {
      return events.map(event => <EventCard {...event} displayImage={false} />)
    }
  }

  return null
}

function EventCard({
  displayImage = true,
  title,
  relationships,
  body,
  fields,
  field_event_date_s_,
}) {
  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const start = field_event_date_s_[0].value
  const when = moment(start).format('dddd, MMMM D [·] h:mma')
  const to = fields.slug
  const type = relationships.field_event_type.name

  return (
    <section
      css={{
        paddingBottom: SPACING['XL'],
        marginTop: SPACING['XL'],
        [MEDIA_QUERIES['L']]: {
          display: 'grid',
          gridTemplateColumns: `16rem 1fr `,
          gridGap: SPACING['M'],
        },
        borderBottom: `solid 1px ${COLORS.neutral['100']}`,
      }}
    >
      {displayImage && <CardImage image={imageData} />}
      <div>
        <Heading
          size="S"
          level={2}
          css={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: SPACING['2XS'],
          }}
        >
          <span css={{ order: 1 }}>
            <Link to={to} kind="description">
              {title}
            </Link>
          </span>
          <span
            css={{
              marginTop: SPACING['3XS'],
              display: 'block',
              color: COLORS.neutral['300'],
              order: 0,
              ...TYPOGRAPHY['3XS'],
            }}
          >
            {when}
          </span>
        </Heading>
        <p
          css={{
            color: COLORS.neutral['300'],
          }}
        >
          {body.summary}
        </p>
        <p>{type}</p>
      </div>
    </section>
  )
}

function sortEventsByStartDate({ events }) {
  function compareStartDate(a, b) {
    const startA = a.field_event_date_s_[0].value
    const startB = b.field_event_date_s_[0].value

    if (moment(startA).isBefore(startB)) {
      return -1
    }

    if (moment(startA).isAfter(startB)) {
      return 1
    }

    return 0
  }

  // Spread the array to make a new one, to
  // avoid mutating og.
  return [...events].sort(compareStartDate)
}
