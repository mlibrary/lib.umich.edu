import React, { useState, useEffect } from 'react'
import * as moment from 'moment'

import {
  findHoursByNodeForNow
} from '../utils/hours'

const now = moment()

export default function Hours({ node }) {
  const [initialized, setInitialized] = useState(false)

  /*
    We don't want to SSR hours since that
    is dynamic to now.
  */
  useEffect(() => {
    setInitialized(true)
  }, [initialized])

  if (!initialized) {
    return <React.Fragment>…</React.Fragment>
  }

  const today = new Date()
  const hours = findHoursByNodeForNow(node, now)

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
