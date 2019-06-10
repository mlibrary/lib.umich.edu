import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem
} from '@umich-lib/core'
import Link from './link'

export default ({ data }) => {
  if (!Array.isArray(data)) {
    return null
  }

  return (
    <Breadcrumb>
      {data.map(({ text, to }, i) => (
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