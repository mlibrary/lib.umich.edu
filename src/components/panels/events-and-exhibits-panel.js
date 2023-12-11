import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import {
  Heading,
  SPACING,
  COLORS,
  Expandable,
  ExpandableButton,
  ExpandableChildren
} from '../../reusable';
import Link from '../link';
import {
  Template,
  TemplateSide,
  TemplateContent
} from '../../components/aside-layout';
import EventCard from '../../components/event-card';
import { EXHIBIT_TYPES, sortEventsByStartDate } from '../../utils/events';
import PropTypes from 'prop-types';

export default function EventsAndExhibitsPanel () {
  /*
    Potential states for today, upcoming, and exhibits:

    - null: means "loading", we need to figure this all out client side.
    - []: An empty array will mean no events.
    - [{...}, {...}, ...]: An array of events, means we have some!
  */
  const [events, setEvents] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState(null);
  const [exhibits, setExhibits] = useState(null);

  const data = useStaticQuery(graphql`
    query {
      events: allNodeEventsAndExhibits(
        filter: {
          relationships: {
            field_design_template: {
              field_machine_name: { eq: "event_exhibit" }
            }
          }
        }
      ) {
        edges {
          node {
            ...eventCardFragment
          }
        }
      }
    }
  `);

  useEffect(() => {
    /*
      As this page is setup on the client,
      prepare all events.
    */
    if (events === null) {
      // Flatten things a bit.
      const events = data.events.edges.map(({ node }) => {
        return node;
      });

      setEvents(sortEventsByStartDate({ events }));
    }

    const now = new Date(new Date().toLocaleString('en', { timeZone: 'America/New_York' })); // toLocaleString for getting date AND time

    // Only process todaysEvents if it hasn't been done already.
    if (events && todaysEvents === null) {
      // useEffects are only client side, so we can use now here.

      // Get Today's events.
      const todaysEvents = events.filter((event) => {
        const start = new Date(event.field_event_date_s_[0].value);
        const end = new Date(event.field_event_date_s_[0].end_value);
        const type = event.relationships.field_event_type.name;
        // We don't want exhibits in the events area.
        if (EXHIBIT_TYPES.includes(type)) {
          return false;
        }

        // get all today using toDateString() that haven't ended yet using getTime()
        // can only use === to compare dates as strings. You can not use it on Date() objects. So keep the .toDateString()'s in place.
        return (now.toDateString() === new Date(start).toDateString()) && (now.getTime() < end.getTime());
      });
      setTodaysEvents(todaysEvents);
    }

    if (events && upcomingEvents === null) {
      // useEffects are only client side, so we can use now here.

      // Get upcoming events.
      // This is repetative... but :shrug:
      const upcomingEvents = events.filter((event) => {
        const start = new Date(event.field_event_date_s_[0].value);
        const type = event.relationships.field_event_type.name;

        // We don't want exhibits in the events area.
        if (EXHIBIT_TYPES.includes(type)) {
          return false;
        }
        return now < start; // all after today.
      });

      setUpcomingEvents(upcomingEvents);
    }

    if (events && exhibits === null) {
      const exhibits = events.filter((event) => {
        const type = event.relationships.field_event_type.name;

        // We don't want exhibits in the events area.
        return EXHIBIT_TYPES.includes(type);
      });

      setExhibits(exhibits);
    }
  }, [events]); // eslint-disable-line

  return (
    <div
      css={{
        marginTop: SPACING['2XL']
      }}
    >
      <Template>
        <TemplateContent>
          <Heading
            level={2}
            size='M'
            css={{
              marginBottom: SPACING.M
            }}
          >
            Today's Events
          </Heading>

          <TodaysEvents events={todaysEvents} />

          <Heading
            level={2}
            size='M'
            css={{
              marginTop: SPACING.M,
              marginBottom: SPACING.M
            }}
          >
            Upcoming Events
          </Heading>

          <UpcomingEvents events={upcomingEvents} />
        </TemplateContent>

        <TemplateSide
          css={{
            '> *:first-of-type': {
              border: 'none'
            }
          }}
        >
          <div
            css={{
              background: COLORS.blue['100'],
              borderRadius: '4px',
              padding: SPACING.M
            }}
          >
            <Heading
              level={2}
              size='M'
              css={{
                marginBottom: SPACING.M
              }}
            >
              Exhibits
            </Heading>

            <ExhibitEvents events={exhibits} hasBorder={false} />
          </div>

          <h2
            css={{
              fontWeight: '700',
              paddingTop: SPACING.XL
            }}
          >
            See past events
          </h2>
          <Link to='https://events.umich.edu/month?filter=sponsors:1186,'>
            Use the U-M events calendar
          </Link>

          <h2
            css={{
              fontWeight: '700',
              paddingTop: SPACING.M,
              marginTop: SPACING.L,
              borderTop: `solid 1px ${COLORS.neutral['100']}`
            }}
          >
            Stay in the know
          </h2>
          <Link to='https://visitor.r20.constantcontact.com/manage/optin?v=001cDYOOus5TIdow4bzSVycvvOQHeBTvaw-u-NrxVEBWd7CK3DPmM7o6fTauJmkB-PmyMdNV2isg8l8Y3gsqV07er-4bFAo3fZNo1cYkbzohp4%3D'>
            Sign up for email updates
          </Link>
        </TemplateSide>
      </Template>
    </div>
  );
}

function TodaysEvents ({ events }) {
  if (Array.isArray(events)) {
    if (events.length === 0) {
      return (
        <p
          css={{
            marginBottom: SPACING['2XL']
          }}
        >
          There are no events scheduled today.
        </p>
      );
    }

    if (events.length > 0) {
      return events.map((event, index) => {
        return (
          <EventCard key={`event-card-${index}`} {...event} />
        );
      });
    }
  }

  return null;
}

TodaysEvents.propTypes = {
  events: PropTypes.array
};

function UpcomingEvents ({ events }) {
  if (Array.isArray(events)) {
    if (events.length === 0) {
      return (
        <p
          css={{
            marginBottom: SPACING['2XL']
          }}
        >
          There are no upcoming events.
        </p>
      );
    }

    if (events.length > 0) {
      return (
        <Expandable>
          <ExpandableChildren show={10}>
            {events.map((event, index) => {
              return (
                <EventCard key={`event-card-${index}`} {...event} />
              );
            })}
          </ExpandableChildren>
          <div
            css={{
              marginTop: SPACING.L
            }}
          >
            <ExpandableButton name='events' count={events.length} />
          </div>
        </Expandable>
      );
    }
  }

  return null;
}

UpcomingEvents.propTypes = {
  events: PropTypes.array
};

function ExhibitEvents ({ events, hasBorder = false }) {
  if (Array.isArray(events)) {
    if (events.length === 0) {
      return (
        <p
          css={{
            marginBottom: SPACING['2XL']
          }}
        >
          There are no upcoming exhibits.
        </p>
      );
    }

    if (events.length > 0) {
      return events.map((event, index) => {
        return (
          <EventCard
            key={`event-card-${index}`}
            {...event}
            displayImage={false}
            hasBorder={hasBorder}
          />
        );
      });
    }
  }

  return null;
}

ExhibitEvents.propTypes = {
  events: PropTypes.array,
  hasBorder: PropTypes.bool
};
