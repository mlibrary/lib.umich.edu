import { graphql, useStaticQuery } from 'gatsby';
import { Heading, Margins, MEDIA_QUERIES, SPACING } from '../../reusable';
import React, { useEffect, useState } from 'react';
import EventCard from '../event-card';
import Link from '../link';
import { sortEventsByStartDate } from '../../utils/events';

/*
 *Featured and latest news and exhibits.
 *
 *"What's happening?"
 *
 *look at all kinds of events that are prioritized,
 *use those, then if we need more add in some
 *non prioritized events (except don't use Exhibits).
 *Make sure we use up to 3, but no more.
 *Sort all of them by date.
 */
export default function WhatsHappening () {
  const [events, setEvents] = useState(null);

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
          ...eventCardFragment
        }
      }
      otherEvents: allNodeEventsAndExhibits(
        filter: {
          field_priority_for_homepage: { eq: false }
          relationships: {
            field_design_template: {
              field_machine_name: { eq: "event_exhibit" }
            }
            field_event_type: { name: { ne: "Exhibit" } }
          }
        }
      ) {
        nodes {
          ...eventCardFragment
        }
      }
    }
  `);

  useEffect(() => {
    if (events === null) {
      // Join exhibits with events, but only keep 3.
      const joinedEvents = sortEventsByStartDate({
        events: data.priorityEvents.nodes,
        onlyTodayOrAfter: true
      }).concat(
        sortEventsByStartDate({
          events: data.otherEvents.nodes,
          onlyTodayOrAfter: true
        })
      );

      const sortedEvents = sortEventsByStartDate({
        events: joinedEvents,
        onlyTodayOrAfter: true
      });

      // Only keep 3
      setEvents(sortedEvents.slice(0, 3));
    }
  }, [events, data.otherEvents.nodes, data.priorityEvents.nodes]);

  return (
    <div
      css={{
        marginBottom: SPACING['3XL'],
        marginTop: SPACING['3XL']
      }}
    >
      <Margins>
        <Heading level={2} size='L'>
          What&rsquo;s happening?
        </Heading>

        {(!events || events.length === 0)
          ? (
              <p css={{ marginTop: SPACING.L, marginBottom: SPACING['2XL'] }}>We don&rsquo;t currently have any upcoming events scheduled or exhibits on display.</p>
            )
          : (
              <>
                <div
                  css={{
                    [MEDIA_QUERIES.S]: {
                      display: 'grid',
                      gridGap: `${SPACING.XL} ${SPACING.M}`,
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
                    }
                  }}
                >
                  {events.map((event, index) => {
                    return (
                      <EventCard
                        {...event}
                        displayImage={false}
                        hasBorder={false}
                        key={index}
                      />
                    );
                  })}
                </div>

                <Link to='/visit-and-study/events-and-exhibits/today-and-upcoming'>
                  View all events
                </Link>
              </>
            )}
      </Margins>
    </div>
  );
}
