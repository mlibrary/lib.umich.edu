import React from 'react'

import { Alert, Margins } from '@umich-lib/core'

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
      <Alert intent="success">
        <Margins>
          <p>
            <strong css={{ fontWeight: '700' }}>
              Thursday is accessibility day.
            </strong>{' '}
            Your visible cursor has been disabled to encourage keyboard only
            use.
          </p>
        </Margins>
      </Alert>
    </div>
  )
}
