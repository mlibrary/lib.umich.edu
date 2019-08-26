import React, { useState, useEffect } from 'react'
import * as moment from 'moment'

/*
  Hours could be on the current node
  or on a parent node, depending
  on some fields.
*/
function getHoursData(node) {
  const { field_hours_different_from_build } = node
  const { field_hours_open, field_room_building } = node.relationships

  if (!field_hours_different_from_build && field_room_building) {
    return field_room_building.relationships.field_hours_open
  }

  return field_hours_open
}

/*
  - Put "paragraph__hours_exceptions" first
  - Add all the other ranges in the order presented
  - Then add "paragraph__fall_and_winter_semester_hours" last
*/
function prioritizeHours(hours) {
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

export default function Hours({ node }) {
  const [initialized, setInitialized] = useState(false)

  /*
    We don't want to SSR hours since that
    is dynamic to now.
  */
  useEffect(() => {
    setInitialized(true)
  }, [initialized])

  const data = prioritizeHours(getHoursData(node))

  if (!initialized || data.length === 0) {
    return <React.Fragment>…</React.Fragment>
  }

  const now = Date.now()
  const today = new Date()

  /*
    Find the set of hours that are for now.
  */
  const hours = data.find(set => {
    if (!set.field_date_range) {
      // no range available in this set of hours.
      return false
    }

    const start = new Date(set.field_date_range.value)
    const end = new Date(set.field_date_range.end_value)

    // Note: Include start and end dates.
    return now >= start && now <= end
  })

  if (!hours) {
    return 'n/a'
  }

  const day = hours.field_hours_open.find(d => d.day === today.getDay())

  return <Time {...day} />
}

/*
  - Display hours if start and end are not equal
  - Display comment if one exists
*/
function Time({ starthours, endhours, comment }) {
  if (comment) {
    return <React.Fragment>{comment}</React.Fragment>
  }

  // Needs to be 24 time format, ie ####.
  const start = starthours < 1000 ? '0' + starthours : starthours
  const end = endhours < 1000 ? '0' + endhours : endhours

  if (start === end) {
    return null
  }

  return (
    <React.Fragment>
      {moment(start, 'HHmm').format('ha')} - {moment(end, 'HHmm').format('ha')}
    </React.Fragment>
  )
}
