import React from 'react'

import { Alert, Margins } from '@umich-lib/core'

import Link from './link'

export default function DevelopmentAlert() {
  return (
    <div
      css={{
        '[data-inner-container]': {
          padding: '0',
          margin: '0',
        },
      }}
    >
      <Alert intent="warning">
        <Margins>
          <p>
            This is an in progress development site. Visit our current website
            at <Link to="https://www.lib.umich.edu">lib.umich.edu</Link>.
          </p>
        </Margins>
      </Alert>
    </div>
  )
}
