import React from 'react'
import FeaturedAndLatestNewsPanel from './featured-and-latest-news'

export default function CustomPanel({ data }) {
  const name = data.field_machine_name

  if (name === 'featured_and_latest_news') {
    return <FeaturedAndLatestNewsPanel data={data} />
  }

  console.warn('Unable to find a panel matching machine name', name)

  return null
}
