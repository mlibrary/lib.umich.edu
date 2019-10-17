import React from 'react'

import { Alert, Margins, SPACING } from '@umich-lib/core'

import Link from './link'

let a11yMode = false

if (process.env.ACCESSIBILITY_MODE === 'true') {
  let date = new Date()
  let dayOfWeek = date.getDay()

  if (dayOfWeek === 1) {
    a11yMode = true
    import('no-mouse-days')
  }
}

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
          {a11yMode && <A11yMessage />}
        </Margins>
      </Alert>
    </div>
  )
}

function A11yMessage() {
  return (
    <p
      css={{
        marginTop: SPACING['XS'],
      }}
    >
      <strong css={{ fontWeight: '700' }}>
        Thursday is accessibility day.
      </strong>{' '}
      Your visible cursor has been disabled to encourage keyboard only use.
    </p>
  )
}
