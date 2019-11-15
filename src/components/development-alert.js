import React, { useState, useEffect } from 'react'

import { Alert, Margins, SPACING } from '@umich-lib/core'

import Link from './link'

const ACCESSIBILITY_MODE = process.env.GATSBY_ACCESSIBILITY_MODE === 'true'

export default function DevelopmentAlert() {
  const [noMouseDay, setNoMouseDay] = useState(false)

  useEffect(() => {
    if (ACCESSIBILITY_MODE) {
      let date = new Date()
      let dayOfWeek = date.getDay()

      if (dayOfWeek === 1) {
        setNoMouseDay(true)
      }
    }
  }, [])

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
            This is an in progress development site (<Link to="/release-notes">release notes</Link>). Use our <Link to="https://umlib.us/wr-qc">contact form</Link> to send questions and comments. You can visit our current website
            at <Link to="https://www.lib.umich.edu">lib.umich.edu</Link>.
          </p>
          {noMouseDay && <A11yMessage />}
        </Margins>
      </Alert>
    </div>
  )
}

function A11yMessage() {
  return (
    <p
      css={{
        marginTop: SPACING['S'],
      }}
    >
      <strong css={{ fontWeight: '700' }}>Monday is accessibility day.</strong>{' '}
      Your visible cursor has been disabled to encourage keyboard only use.
    </p>
  )
}
