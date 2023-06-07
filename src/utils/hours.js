import * as dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

/*
  Hours could be on the current node
  or on a parent node, depending
  on some fields.
*/
export function getHoursFromNode ({ node }) {
  const { field_display_hours_: fieldDisplayHours_ } = node;

  // Only check for hours if the node says to display hours.
  if (!fieldDisplayHours_) {
    return null;
  }

  const { field_hours_different_from_build: fieldHoursDifferentFromBuild } = node;

  // Hours come directly from this node.
  if (fieldHoursDifferentFromBuild) {
    const { field_hours_open: fieldHoursOpen } = node.relationships;

    return prioritizeHours({
      hours: fieldHoursOpen
    });
  } else {
    const { field_room_building: fieldRoomBuilding, field_parent_location: fieldParentLocation } = node.relationships;

    // Display hours from field_room_building
    if (fieldRoomBuilding && fieldRoomBuilding.field_display_hours_) {
      return prioritizeHours({
        hours: fieldRoomBuilding.relationships.field_hours_open
      });
    }

    // Display hours from field_parent_location
    if (fieldParentLocation && fieldParentLocation.field_display_hours_) {
      return prioritizeHours({
        hours: fieldParentLocation.relationships.field_hours_open
      });
    }

    // Do not display field_room_building hours, but use the
    // related parent location from the building.
    if (
      fieldRoomBuilding &&
      !fieldRoomBuilding.field_display_hours_ &&
      fieldRoomBuilding.relationships.field_parent_location &&
      fieldRoomBuilding.relationships.field_parent_location
        .field_display_hours_
    ) {
      return prioritizeHours({
        hours:
          fieldRoomBuilding.relationships.field_parent_location.relationships
            .field_hours_open
      });
    }

    if (
      fieldParentLocation &&
      !fieldParentLocation.field_display_hours_ &&
      fieldParentLocation.relationships.field_parent_location &&
      fieldParentLocation.relationships.field_parent_location
        .field_display_hours_
    ) {
      return prioritizeHours({
        hours:
          fieldParentLocation.relationships.field_parent_location
            .relationships.field_hours_open
      });
    }
  }

  return null;
}

/*
  Pass in a node and dayjs "now" and get back
  formated string for hours from "now".
*/
export function findHoursSetByNodeForNow ({ node, now }) {
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
    const start = set.field_date_range.value;
    const end = set.field_date_range.end_value;

    // Check if "now" is within the range including start and end days.
    return now.isSameOrAfter(dayjs(start), 'day') && now.isSameOrBefore(dayjs(end), 'day');
  });

  return nowHour;
}

export function displayHours ({ node, now }) {
  const hoursSet = findHoursSetByNodeForNow({ node, now });
  if (!hoursSet) {
    return null;
  }

  const hoursForNow = hoursSet.field_hours_open.find(
    (d) => {
      return d.day === now.day();
    }
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
      return dayjs(String(time24Hours), 'HHmm').format(setTimeFormat);
    };

    const combinedValues = (separator = 'to') => {
      return [`${formatTime(starthours)} ${separator} ${formatTime(endhours)}`, comment].filter(Boolean).join(', ');
    };

    text = combinedValues('-');
    label = combinedValues();
  }

  return {
    text,
    label
  };
}

/*
  - Put "paragraph__hours_exceptions" first
  - Add all the other ranges in the order presented
  - Then add "paragraph__fall_and_winter_semester_hours" last
*/
function prioritizeHours ({ hours }) {
  if (!hours) {
    return [];
  }

  const types = [
    'paragraph__hours_exceptions',
    'paragraph__fall_and_winter_semester_hours'
  ];
  const exceptions = hours.filter((set) => {
    return set.__typename === types[0];
  });
  const fallAndWinter = hours.filter((set) => {
    return set.__typename === types[1];
  });
  const everythingElse = hours.filter((set) => {
    return !types.includes(set.__typename);
  });

  const prioritized = []
    .concat(exceptions, everythingElse, fallAndWinter)
    .filter((el) => {
      return el != null;
    });

  return prioritized;
}
