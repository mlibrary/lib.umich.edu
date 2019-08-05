import React, { useState, useEffect } from 'react'

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

  console.log('data', data)

  /*
    Find the set of hours that are for now.
  */
  const hours = data.find(set => {
    if (!set.field_date_range) { // no range.
      return false
    }

    const start = Date.parse(set.field_date_range.value)
    const end = Date.parse(set.field_date_range.end_value)

    console.log('start, end, now', start, end, now)

    return now => start && now <= end
  })

  console.log('hours', hours)

  return (
    <p>[todo: hours]</p>
  )
}