import React, { useState, useEffect } from 'react'
import * as moment from 'moment';

export default function Hours({ data }) {
  const [initialized, setInitialized] = useState(false)

  /*
    We don't want to SSR hours since that
    is dynamic to now.
  */
  useEffect(() => {
    setInitialized(true)
  }, [initialized])

  if (!initialized) {
    return null
  }

  const now = Date.now()
  const today = new Date()
  const exceptionHours = data.find(set => set.__typename === "paragraph__hours_exceptions")

  if (exceptionHours) {
    const exceptionDay = exceptionHours.field_hours_open.find(d => d.day === today.getDay())

    /*
      Drupal sets a -1 to hours not set by editor.
      We only care if hours are not -1.
    */
    if (exceptionDay.starthours !== -1) {
      return <Time {...exceptionDay} />
    }
  }
  
  /*
    Find the set of hours that are for now.
  */
  const hours = data.find(set => {
    if (!set.field_date_range) { // no range available in this set of hours.
      return false
    }

    const start = new Date(set.field_date_range.value)
    const end = new Date(set.field_date_range.end_value)

    // Note: Include start and end dates.
    return now >= start && now <= end
  })
  const day = hours.field_hours_open.find(d => d.day === today.getDay())

  return <Time {...day} />
}

function Time({ starthours, endhours, comment }) {
  // Needs to be 24 time format, ie ####.
  const start = starthours < 1000 ? '0' + starthours : starthours
  const end = endhours < 1000 ? '0' + endhours : endhours

  return (
    <React.Fragment>
      {moment(start, 'HHmm').format('ha')} - {moment(end, 'HHmm').format('ha')}
    </React.Fragment>
  )
}