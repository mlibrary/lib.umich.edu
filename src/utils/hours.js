import * as moment from 'moment';

import {
  isSameDay,
  parseISO,
  getDay,
  isAfter,
  isBefore,
  format as datefnsformat,
} from 'date-fns';

/*
  Hours could be on the current node
  or on a parent node, depending
  on some fields.
*/
export function getHoursFromNode({ node }) {
  const { field_display_hours_ } = node;

  // Only check for hours if the node says to display hours.
  if (!field_display_hours_) {
    return null;
  }

  const { field_hours_different_from_build } = node;

  // Hours come directly from this node.
  if (field_hours_different_from_build) {
    const { field_hours_open } = node.relationships;

    return prioritizeHours({
      hours: field_hours_open,
    });
  } else {
    const { field_room_building, field_parent_location } = node.relationships;

    // Display hours from field_room_building
    if (field_room_building && field_room_building.field_display_hours_) {
      return prioritizeHours({
        hours: field_room_building.relationships.field_hours_open,
      });
    }

    // Display hours from field_parent_location
    if (field_parent_location && field_parent_location.field_display_hours_) {
      return prioritizeHours({
        hours: field_parent_location.relationships.field_hours_open,
      });
    }

    // Do not display field_room_building hours, but use the
    // related parent location from the building.
    if (
      field_room_building &&
      !field_room_building.field_display_hours_ &&
      field_room_building.relationships.field_parent_location &&
      field_room_building.relationships.field_parent_location
        .field_display_hours_
    ) {
      return prioritizeHours({
        hours:
          field_room_building.relationships.field_parent_location.relationships
            .field_hours_open,
      });
    }

    if (
      field_parent_location &&
      !field_parent_location.field_display_hours_ &&
      field_parent_location.relationships.field_parent_location &&
      field_parent_location.relationships.field_parent_location
        .field_display_hours_
    ) {
      return prioritizeHours({
        hours:
          field_parent_location.relationships.field_parent_location
            .relationships.field_hours_open,
      });
    }
  }

  return null;
}

/*
  Pass in a node and moment "now" and get back 
  formated string for hours from "now".
*/
export function findHoursSetByNodeForNow({ node, now }) {
  const allHours = getHoursFromNode({ node });

  if (!allHours) {
    return null;
  }

  const nowHour = allHours.find((set) => {
    if (!set.field_date_range) {
      // no range available in this set of hours.
      return null;
    }

    // Start and end of hour set range.
    const start = parseISO(set.field_date_range.value);
    const end = parseISO(set.field_date_range.end_value);

    // Check if "now" is within the range including start and end days.
    return (
      isSameDay(now, start) || isSameDay(now, end) || (now > start && now < end)
    );
  });

  return nowHour;
}

export function displayHours({ node, now }) {
  const hoursSet = findHoursSetByNodeForNow({ node, now });

  if (!hoursSet) {
    return null;
  }
  const hoursForNow = hoursSet.field_hours_open.find(
    (d) => d.day === getDay(now)
  );

  if (!hoursForNow) {
    return null;
  }

  const { starthours, endhours, comment } = hoursForNow;

  if (!comment && starthours === endhours) {
    return null;
  }

  let [text, label] = [comment];

  if (starthours !== endhours) {
    const formatTime = (time) => {
      const time24Hours = time < 1000 ? '0' + time : time;
      const getMinutes = time24Hours.toString().slice(-2);
      const setTimeFormat = getMinutes === '00' ? 'ha' : 'h:mma';
      return moment(time24Hours, 'HHmm').format(setTimeFormat);
    };

    const combinedValues = (separator = 'to') => {
      return [
        `${formatTime(starthours)} ${separator} ${formatTime(endhours)}`,
        comment,
      ]
        .filter(Boolean)
        .join(', ');
    };

    text = combinedValues('-');
    label = combinedValues();
  }

  return {
    text,
    label,
  };
}

/*
  - Put "paragraph__hours_exceptions" first
  - Add all the other ranges in the order presented
  - Then add "paragraph__fall_and_winter_semester_hours" last
*/
function prioritizeHours({ hours }) {
  if (!hours) {
    return [];
  }

  const types = [
    'paragraph__hours_exceptions',
    'paragraph__fall_and_winter_semester_hours',
  ];
  const exceptions = hours.filter((set) => set.__typename === types[0]);
  const fallAndWinter = hours.filter((set) => set.__typename === types[1]);
  const everythingElse = hours.filter((set) => !types.includes(set.__typename));

  const prioritized = []
    .concat(exceptions, everythingElse, fallAndWinter)
    .filter((el) => el != null);

  return prioritized;
}
