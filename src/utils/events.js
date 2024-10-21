/* eslint-disable camelcase */
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
    day: 'numeric',
    month: 'long',
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

export const eventFormatWhen = ({ start, end, kind, type }) => {
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
};

export const eventFormatWhere = ({ kind, node }) => {
  const where = [];
  const { field_event_online, field_online_event_link, field_non_library_location_addre, relationships } = node;
  const { field_event_building, field_event_room } = relationships || {};
  const hasLocation = Boolean(field_non_library_location_addre?.organization || field_event_building);
  const isBrief = kind === 'brief';

  // Online events
  if (field_event_online) {
    where.push({ label: hasLocation ? 'Hybrid ' : 'Online ' });

    if (field_online_event_link && !isBrief) {
      where.push({
        href: field_online_event_link.uri,
        label: field_online_event_link.title
      });
    }
  }

  // Handle location details
  if (hasLocation) {
    const roomName = field_event_room?.title;
    const buildingName = field_event_building?.title;
    const floorName = field_event_room?.relationships?.field_floor?.name?.split(' - ').pop();
    const roomNumber = field_event_room?.field_room_number ? `Room ${field_event_room.field_room_number}` : null;
    const { organization, address_line1, locality, administrative_area, postal_code } = field_non_library_location_addre;
    const stateZip = [administrative_area, postal_code].filter(Boolean).join(' ');

    const fullAddress = [address_line1, locality, stateZip].filter(Boolean).join(', ');

    // Library locations
    if (roomName) {
      const locationLabel = [buildingName, floorName, roomNumber].filter(Boolean).join(', ');

      if (isBrief) {
        where.push({ label: [roomName, buildingName].filter(Boolean).join(', ') });
      } else {
        where.push({ label: roomName });
        where.push({
          className: 'margin-top-none',
          label: locationLabel,
          locality: fullAddress
        });
      }
    } else {
      // Non-library locations
      where.push({ label: organization });
      where.push({
        className: 'margin-top-none',
        label: fullAddress,
        locality: fullAddress
      });
    }
  }

  return where;
};

export const sortEventsByStartDate = ({ events, onlyTodayOrAfter = false }) => {
  const uniqueEvents = [...events].filter(
    (value, index, array) => {
      return array.findIndex((element) => {
        return element.id === value.id;
      }) === index;
    }
  );

  /*
   * Duplicate events that have many occurances by
   * checking if it has many datetimes.
   */
  let occurances = [];
  uniqueEvents.forEach((event) => {
    /* eslint-disable no-underscore-dangle */
    const hasOccurances = event.field_event_date_s_.length > 1;

    if (hasOccurances) {
      const dates = event.field_event_date_s_;

      // Make an event in the array for each date.
      dates.forEach((date) => {
        occurances = occurances.concat([
          {
            ...event,
            // The one occurance
            fieldEventDateS: [date]
          }
        ]);
      });
    } else {
      occurances = occurances.concat([event]);
    }
  });

  const compareStartDate = (compareLeft, compareRight) => {
    const startA = compareLeft.fieldEventDateS
      ? compareLeft.fieldEventDateS[0].value
      : compareLeft.field_event_date_s_[0].value;

    const startB = compareRight.fieldEventDateS
      ? compareRight.fieldEventDateS[0].value
      : compareRight.field_event_date_s_[0].value;

    if (new Date(startA) < new Date(startB)) {
      return -1;
    }

    if (new Date(startA) > new Date(startB)) {
      return 1;
    }

    return 0;
  };

  const sortedEvents = [...occurances].sort(compareStartDate);

  if (onlyTodayOrAfter) {
    const eventEndTimeIsAfterNow = (event) => {
      const eventEndTime = new Date(event.fieldEventDateS ? event.fieldEventDateS[0].end_value : event.field_event_date_s_[0].end_value);
      const now = new Date(new Date().toLocaleString('en', { timeZone: 'America/New_York' }));
      const result = eventEndTime > now;

      return result;
    };

    return sortedEvents.filter(eventEndTimeIsAfterNow);
  }

  return sortedEvents;
};
