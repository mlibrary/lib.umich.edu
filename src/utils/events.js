import {
  format,
  isBefore,
  isAfter,
  isSameYear,
  isSameDay,
  parseISO
} from 'date-fns';

export const EXHIBIT_TYPES = ['Exhibit', 'Exhibition'];

/*
  Rules for how to handle parsing an event
  start and end date times and the kinds of
  display: brief (cards) and full (event page metadata).

  Use cases:

  (A) The event is an exhibit and it needs just
  the Month, Day range.

    Brief and Full
      => September 2 - October 30
      => December 10, 2020 - January 21, 2021

  (B) The event is not an exhibit and needs
  to display the full start and end. It all
  happens same day.

    Brief:
      => Tuesday, September 15 · 3:00pm - 3:50pm

    Full:
      => Tuesday, September 15, 2020 from 3:00pm - 3:50pm

  (C) A multi-day event. Show full range.

    Brief:
      => July 10 · 2:00pm to July 26 · 10:30am
      => December 15 · 3:00pm to January 8, 2021 · 3:50pm

    Full:
      => Wednesday, December 15, 2020 from 3:00pm to Friday, January 8, 2021 at 3:50pm
*/
export function eventFormatWhen ({ start, end, kind, type }) {
  const isBrief = kind === 'brief';
  const isExhibit = EXHIBIT_TYPES.includes(type);
  const S = new Date(start);
  const E = new Date(end);
  const isSameEventYear = isSameYear(S, E);
  const isSameEventDay = isSameDay(S, E);

  // Exhibits share same format, regardless of kind.
  if (isExhibit) {
    if (isSameEventYear) {
      return format(S, 'MMMM d') + format(E, '- MMMM d');
    } else {
      return format(S, 'MMMM d, yyyy') + format(E, '- MMMM d, yyyy');
    }
  }

  if (isBrief) {
    if (isSameEventDay) {
      return format(S, 'eeee, MMMM d · h:mmaaa - ') + format(E, 'h:mmaaa');
    } else {
      if (isSameEventYear) {
        return (
          format(S, 'eeee, MMMM d · h:mmaaa - ') +
          format(E, 'eeee, MMMM d · h:mmaaa')
        );
      } else {
        return (
          format(S, 'eeee, MMMM d · h:mmaaa - ') +
          format(E, 'eeee, MMMM d, yyyy · h:mma')
        );
      }
    }
  }

  if (isSameEventDay) {
    return (
      format(S, "eeee, MMMM d, yyyy 'from' h:mmaaa - ") + format(E, 'h:mmaaa')
    );
  }

  if (isSameEventYear) {
    return (
      format(S, 'eeee, MMMM d · h:mmaaa - ') +
      format(E, 'eeee, MMMM d · h:mmaaa')
    );
  }

  return (
    format(S, 'eeee, MMMM d · h:mmaaa - ') +
    format(E, 'eeee, MMMM d, yyyy · h:mmaaa')
  );
}

export function eventFormatWhere ({ node, kind }, includeLink = false) {
  const where = [];

  if (node.field_event_online) {
    where.push({
      label: 'Online'
    });
  }

  if (includeLink && node.field_online_event_link) {
    where.push({
      label: node.field_online_event_link.title,
      href: node.field_online_event_link.uri
    });
  }

  let hasLocation = false;

  if (!!node.field_event_in_non_library_locat && !!node.field_non_library_location_addre) {
    if (node.field_non_library_location_addre.organization) {
      hasLocation = true;
      where.push({
        label: node.field_non_library_location_addre.organization
      });
    }
    if (kind !== 'brief') {
      const stateZip = [
        node.field_non_library_location_addre.administrative_area,
        node.field_non_library_location_addre.postal_code
      ].filter((field) => {
        return field;
      }).join(' ');
      where.push({
        label: [
          node.field_non_library_location_addre.address_line1,
          node.field_non_library_location_addre.locality,
          stateZip
        ].filter((field) => {
          return field;
        }).join(', '),
        className: 'margin-top-none'
      });
    }
  }

  const building = node.relationships.field_event_building?.title;
  const room = node.relationships.field_event_room?.title;

  if (building) {
    hasLocation = true;
    where.push({
      label: [room, building].join(', ')
    });
  }

  if (node.field_event_online && hasLocation) {
    where[0].label = 'Hybrid';
  }

  return where;
}

export function sortEventsByStartDate ({ events, onlyTodayOrAfter = false }) {
  const uniqueEvents = [...events].filter(
    (v, i, a) => {
      return a.findIndex((t) => {
        return t.id === v.id;
      }) === i;
    }
  );

  // Duplicate events that have many occurances by
  // checking if it has many datetimes.
  let occurances = [];
  uniqueEvents.forEach((event) => {
    const hasOccurances = event.field_event_date_s_.length > 1;

    if (hasOccurances) {
      const dates = event.field_event_date_s_;

      // Make an event in the array for each date.
      dates.forEach((date, i) => {
        occurances = occurances.concat([
          {
            ...event,
            field_event_date_s_: [date] // The one occurance
          }
        ]);
      });
    } else {
      occurances = occurances.concat([event]);
    }
  });

  const sortedEvents = [...occurances].sort(compareStartDate);

  function compareStartDate (a, b) {
    const startA = a.field_event_date_s_[0].value;
    const startB = b.field_event_date_s_[0].value;

    if (isBefore(parseISO(startA), parseISO(startB))) {
      return -1;
    }

    if (isAfter(parseISO(startA), parseISO(startB))) {
      return 1;
    }
    return 0;
  }

  if (onlyTodayOrAfter) {
    function isBeforeToday (event) {
      const result = isBefore(
        parseISO(event.field_event_date_s_[0].end_value),
        new Date()
      );

      return !result;
    }

    return sortedEvents.filter(isBeforeToday);
  }

  return sortedEvents;
}
