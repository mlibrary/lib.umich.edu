import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Heading, SPACING, COLORS, TYPOGRAPHY, Icon } from '@umich-lib/core'
import CardImage from '../../maybe-design-system/card-image'
import MEDIA_QUERIES from '../../maybe-design-system/media-queries'
import * as moment from 'moment'
import Link from '../link'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../../components/aside-layout'

import {
  EXHIBIT_TYPES,
  eventFormatWhen,
  eventFormatWhere,
} from '../../utils/events'
import icons from '../../maybe-design-system/icons'

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
        if (EXHIBIT_TYPES.includes(type)) {
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
        if (EXHIBIT_TYPES.includes(type)) {
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
        return EXHIBIT_TYPES.includes(type)
      })

      setExhibits(exhibits)
    }
  }, [events]) // eslint-disable-line

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

        <h2
          css={{
            fontWeight: '700',
            paddingTop: SPACING['XL'],
          }}
        >
          See past events
        </h2>
        <Link to="https://events.umich.edu/month?filter=sponsors:1186,">
          Use the U-M events calendar
        </Link>

        <h2
          css={{
            fontWeight: '700',
            paddingTop: SPACING['M'],
            marginTop: SPACING['L'],
            borderTop: `solid 1px ${COLORS.neutral['100']}`,
          }}
        >
          Stay in the know
        </h2>
        <Link to="https://visitor.r20.constantcontact.com/manage/optin?v=001cDYOOus5TIdow4bzSVycvvOQHeBTvaw-u-NrxVEBWd7CK3DPmM7o6fTauJmkB-PmyMdNV2isg8l8Y3gsqV07er-4bFAo3fZNo1cYkbzohp4%3D">
          Sign up for email updates
        </Link>
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

function EventCard(node) {
  const {
    displayImage = true,
    title,
    relationships,
    body,
    fields,
    field_event_date_s_,
  } = node
  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const start = field_event_date_s_[0].value
  const end = field_event_date_s_[0].end_value
  const type = relationships.field_event_type.name
  const isAnExhibit = EXHIBIT_TYPES.includes(type)
  const when = eventFormatWhen({
    start,
    end,
    kind: 'brief',
    type,
  })
  const where = eventFormatWhere({
    node,
    kind: 'brief',
  })
  const to = fields.slug

  return (
    <section
      css={{
        paddingBottom: SPACING['L'],
        marginTop: SPACING['L'],
        [MEDIA_QUERIES['L']]: {
          display: displayImage ? 'grid' : 'block',
          gridTemplateColumns: `16rem 1fr `,
          gridGap: SPACING['M'],
        },
        borderBottom: isAnExhibit ? '' : `solid 1px ${COLORS.neutral['100']}`,
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
            marginTop: SPACING['2XS'],
            color: COLORS.neutral['300'],
          }}
        >
          {body.summary}
        </p>

        <p
          css={{
            marginTop: SPACING['2XS'],
          }}
        >
          <span
            css={{
              color: COLORS.neutral['300'],
              marginRight: SPACING['L'],
            }}
          >
            <Icon d={icons['address']} />
            <span
              css={{
                marginLeft: SPACING['XS'],
              }}
            >
              <span className="visually-hidden">Where: </span>
              {where}
            </span>
          </span>
          {!isAnExhibit && (
            <span
              css={{
                color: COLORS.neutral['300'],
              }}
            >
              <Icon d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
              <span
                css={{
                  marginLeft: SPACING['XS'],
                }}
              >
                <span className="visually-hidden">Event type: </span>
                {type}
              </span>
            </span>
          )}
        </p>
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
