import React from 'react'
import {
  Heading
} from '@umich-lib/core'

export default function HoursLitePanel({ data }) {
  console.log('HoursLitePanel', data)

  const {
    field_title
  } = data

  return (
    <section>
      <Heading level={2} size="XL">{field_title}</Heading>
    </section>
  )
}