import React from 'react'
import Link from './link'

export default function LocationAnchoredLinks ({ node }) {
  const parentTitle = node.relationships?.field_parent_location?.title

  const title = parentTitle ? parentTitle : node.title
  const titleSlugged = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  return (
    <Link to={`/locations-and-hours/hours-view#${titleSlugged}`}>
      Views hours
    </Link>
  )
}