import * as moment from 'moment'

/*
  Hours could be on the current node
  or on a parent node, depending
  on some fields.
*/
export function getHoursFromNode({ node }) {
  const { field_hours_different_from_build } = node
  const { field_hours_open, field_room_building } = node.relationships

  if (!field_hours_different_from_build && field_room_building) {
    return prioritizeHours({
      hours: field_room_building.relationships.field_hours_open,
    })
  }

  return prioritizeHours({ hours: field_hours_open })
}

/*
  Pass in a node and moment "now" and get back 
  formated string for hours from "now".
*/
export function findHoursSetByNodeForNow({ node, now }) {
  const allHours = getHoursFromNode({ node })

  const nowHour = allHours.find(set => {
    if (!set.field_date_range) {
      // no range available in this set of hours.
      return null
    }

    // Star and end of hour set range.
    const start = set.field_date_range.value
    const end = set.field_date_range.end_value

    // Check if "now" is within the range including start and end days.
    return now.isSameOrAfter(start, 'day') && now.isSameOrBefore(end, 'day')
  })

  return nowHour
}

export function displayHours({ node, now }) {
  const hoursSet = findHoursSetByNodeForNow({ node, now })

  if (!hoursSet) {
    return null
  }

  const hoursForNow = hoursSet.field_hours_open.find(d => d.day === now.day())

  if (!hoursForNow) {
    return null
  }

  const { starthours, endhours, comment } = hoursForNow

  if (comment) {
    return comment
  }

  // Needs to be 24 time format, ie ####.
  const start = starthours < 1000 ? '0' + starthours : starthours
  const end = endhours < 1000 ? '0' + endhours : endhours

  if (start === end) {
    return null
  }

  return (
    moment(start, 'HHmm').format('ha') +
    ' - ' +
    moment(end, 'HHmm').format('ha')
  )
}

/*
  - Put "paragraph__hours_exceptions" first
  - Add all the other ranges in the order presented
  - Then add "paragraph__fall_and_winter_semester_hours" last
*/
function prioritizeHours({ hours }) {
  if (!hours) {
    return []
  }

  const types = [
    'paragraph__hours_exceptions',
    'paragraph__fall_and_winter_semester_hours',
  ]
  const exceptions = hours.find(set => set.__typename === types[0])
  const fallAndWinter = hours.find(set => set.__typename === types[1])
  const everythingElse = hours.filter(set => !types.includes(set.__typename))

  const prioritized = []
    .concat(exceptions, everythingElse, fallAndWinter)
    .filter(el => el != null)

  return prioritized
}
