import React, { useState, useEffect } from 'react'

import { Alert, Margins, SPACING } from '@umich-lib/core'

import Link from './link'

const ACCESSIBILITY_MODE = process.env.GATSBY_ACCESSIBILITY_MODE == 'true'

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
          <NoMouseDay />
        </Margins>
      </Alert>
    </div>
  )
}

function NoMouseDay() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (ACCESSIBILITY_MODE) {
      let date = new Date()
      let dayOfWeek = date.getDay()

      if (dayOfWeek === 1) {
        setActive(true)
      }
    }
  }, [])

  if (active) {
    import('no-mouse-days')
    return <A11yMessage />
  }

  return null
}

function A11yMessage() {
  return (
    <p
      css={{
        marginTop: SPACING['XS'],
      }}
    >
      <strong css={{ fontWeight: '700' }}>Monday is accessibility day.</strong>{' '}
      Your visible cursor has been disabled to encourage keyboard only use.
    </p>
  )
}
