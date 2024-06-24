export const EXHIBIT_TYPES = ['Exhibit', 'Exhibition'];

/*
 *Rules for how to handle parsing an event
 *start and end date times and the kinds of
 *display: brief (cards) and full (event page metadata).
 *
 *Use cases:
 *
 *(A) The event is an exhibit and it needs just
 *the Month, Day range.
 *
 *  Brief and Full
 *    => September 2 - October 30
 *    => December 10, 2020 - January 21, 2021
 *
 *(B) The event is not an exhibit and needs
 *to display the full start and end. It all
 *happens same day.
 *
 *  Brief:
 *    => Tuesday, September 15 · 3:00pm - 3:50pm
 *
 *  Full:
 *    => Tuesday, September 15, 2020 from 3:00pm - 3:50pm
 *
 *(C) A multi-day event. Show full range.
 *
 *  Brief:
 *    => July 10 · 2:00pm to July 26 · 10:30am
 *    => December 15 · 3:00pm to January 8, 2021 · 3:50pm
 *
 *  Full:
 *    => Wednesday, December 15, 2020 from 3:00pm to Friday, January 8, 2021 at 3:50pm
 */
const dateFormat = (date, ...properties) => {
  const options = {
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York'
  };
  if (properties.includes('weekday')) {
    options.weekday = 'long';
  }
  if (properties.includes('year')) {
    options.year = 'numeric';
  }
  return date.toLocaleDateString('en-us', options);
};

const timeFormat = (date) => {
  return date.toLocaleTimeString('en-US', { timeStyle: 'short', timeZone: 'America/New_York' });
};

export function eventFormatWhen ({ start, end, kind, type }) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startTime = timeFormat(startDate);
  const endTime = timeFormat(endDate);
  const isSameYear = startDate.getFullYear() === endDate.getFullYear();
  const isSameDay = dateFormat(startDate, 'year') === dateFormat(endDate, 'year');

  // Exhibits share same format, regardless of kind.
  if (EXHIBIT_TYPES.includes(type)) {
    if (isSameYear) {
      return `${dateFormat(startDate)} - ${dateFormat(endDate)}`;
    }
    return `${dateFormat(startDate, 'year')} - ${dateFormat(endDate, 'year')}`;
  }

  if (kind === 'brief') {
    if (isSameDay) {
      return `${dateFormat(startDate, 'weekday')} · ${startTime} - ${endTime}`;
    }
    if (isSameYear) {
      return `${dateFormat(startDate, 'weekday')} · ${startTime} ${dateFormat(endDate, 'weekday')} · ${endTime}`;
    }
    return `${dateFormat(startDate, 'weekday')} · ${startTime} - ${dateFormat(endDate, 'weekday', 'year')} · ${endTime}`;
  }

  if (isSameDay) {
    return `${dateFormat(startDate, 'weekday', 'year')} from ${startTime} - ${endTime}`;
  }

  if (isSameYear) {
    return `${dateFormat(startDate, 'weekday')} · ${endTime} - ${dateFormat(endDate, 'weekday')} · ${endTime}`;
  }

  return `${dateFormat(startDate, 'weekday')} · ${endTime} - ${dateFormat(endDate, 'weekday', 'year')} · ${endTime}`;
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

  if (Boolean(node.field_event_in_non_library_locat) && Boolean(node.field_non_library_location_addre)) {
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

  /*
   * Duplicate events that have many occurances by
   * checking if it has many datetimes.
   */
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

    if (new Date(startA) < new Date(startB)) {
      return -1;
    }

    if (new Date(startA) > new Date(startB)) {
      return 1;
    }

    return 0;
  }

  if (onlyTodayOrAfter) {
    function eventEndTimeIsAfterNow (event) {
      const eventEndTime = new Date(event.field_event_date_s_[0].end_value);
      const now = new Date(new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' }));

      const result = eventEndTime > now;

      return result;
    }

    return sortedEvents.filter(eventEndTimeIsAfterNow);
  }

  return sortedEvents;
}
