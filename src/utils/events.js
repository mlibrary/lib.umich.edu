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
  const isSameYear = S.getFullYear() === E.getFullYear();
  const isSameDay = (S, E) => {
    return S.getFullYear() === E.getFullYear() &&
    S.getMonth() === E.getMonth() &&
    S.getDate() === E.getDate();
  };

  const sWeekday = S.toLocaleDateString('en-US', { weekday: 'long' });
  const sMonth = S.toLocaleDateString('en-US', { month: 'long' });
  const sDayDate = S.getDate();
  const sYear = S.getFullYear();
  const sTime = S.toLocaleTimeString('en-US', { timeStyle: 'short' });

  const eWeekday = E.toLocaleDateString('en-US', { weekday: 'long' });
  const eMonth = E.toLocaleDateString('en-US', { month: 'long' });
  const eDayDate = E.getDate();
  const eYear = E.getFullYear();
  const eTime = E.toLocaleTimeString('en-US', { timeStyle: 'short' });

  // Exhibits share same format, regardless of kind.
  if (isExhibit) {
    if (isSameYear) {
      return `${sMonth} ${sDayDate} - ${eMonth} ${eDayDate}`;
    } else {
      return `${sMonth} ${sDayDate}, ${sYear} - ${eMonth} ${eDayDate}, ${eYear}`;
    }
  }

  if (isBrief) {
    if (isSameDay) {
      return `${sWeekday}, ${sMonth} ${sDayDate} · ${sTime} - ${eTime}`;
    } else {
      if (isSameYear) {
        return `${sWeekday}, ${sMonth} ${sDayDate} · ${sTime} ${eWeekday}, ${eMonth} ${eDayDate} · ${eTime}`;
      } else {
        return `${sWeekday}, ${sMonth} ${sDayDate} · ${sTime} - ${eWeekday}, ${eMonth} ${eDayDate}, ${eYear} · ${eTime}`;
      }
    }
  }

  if (isSameDay) {
    return `${sWeekday}, ${sMonth} ${sDayDate}, ${sYear} from ${sTime} - ${eWeekday}, ${eMonth} ${eDayDate} · ${eTime}`;
  }

  if (isSameYear) {
    return `${sWeekday}, ${sMonth} ${sDayDate} · ${eTime} - ${eWeekday}, ${eMonth} ${eDayDate} · ${eTime}`;
  }
  return `${sWeekday}, ${sMonth} ${sDayDate} · ${eTime} - ${eWeekday}, ${eMonth} ${eDayDate}, ${eYear} · ${eTime}`;
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

    if (new Date(startA) < new Date(startB)) {
      return -1;
    }

    if (new Date(startA) > new Date(startB)) {
      return 1;
    }

    return 0;
  }

  if (onlyTodayOrAfter) {
    function isAfterToday (event) {
      // Why are we only checking after today if it's called onlyTODAYOrAfter?

      const result = () => {
        const eventDate = new Date(event.field_event_date_s_[0].end_value);
        const now = new Date();
        return (
          eventDate.getFullYear() > now.getFullYear() &&
          eventDate.getMonth() > now.getMonth() &&
          eventDate.getDate() > now.getDate()
        );
      };
      return !result;
    }

    return sortedEvents.filter(isAfterToday);
  }

  return sortedEvents;
}
