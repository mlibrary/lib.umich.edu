import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem
} from '@umich-lib/core'
import Link from './link'

export default ({ data }) => {
  /*
    Breadcrumb data is provided as encoded JSON.
    We need to decode it and check if it's valid.
  */
  const parsed_data = JSON.parse(data)
  
  if (!parsed_data) {
    return null
  }

  return (
    <Breadcrumb>
      {parsed_data.map(({ text, to }, i) => (
        <BreadcrumbItem>
          {to ? (
            <Link to={to}>{text}</Link>
          ) : (
            <React.Fragment>{text}</React.Fragment>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}