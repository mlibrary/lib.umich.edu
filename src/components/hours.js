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

  /*
   Catch if we did  not find any hours.
  */
  if (!hours) {
    return <span>[not available]</span>
  }

  const today = new Date()
  const day = hours.field_hours_open.find(d => d.day === today.getDay())
  const start = day.starthours < 1000 ? '0' + day.starthours : day.starthours
  const end = day.endhours < 1000 ? '0' + day.endhours : day.endhours

  return (
    <React.Fragment>
      {moment(start, 'HHmm').format('ha')} - {moment(end, 'HHmm').format('ha')}
    </React.Fragment>
  )
}