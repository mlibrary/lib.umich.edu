import React, { useState, useEffect } from 'react'

import { Heading, SPACING, Button, List } from '@umich-lib/core'

import { DialogOverlay, DialogContent } from './dialog'
import Link from './link'

const ACCESSIBILITY_MODE = process.env.GATSBY_ACCESSIBILITY_MODE === 'true'

export default function DevelopmentMessage() {
  const [noMouseDay, setNoMouseDay] = useState(false)
  const [showDialog, setShowDialog] = React.useState(true)
  const close = () => setShowDialog(false)
  const buttonRef = React.useRef()

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
    <DialogOverlay
      isOpen={showDialog}
      onDismiss={close}
      initialFocusRef={buttonRef}
    >
      <DialogContent
        css={{
          '> *:not(:last-child)': {
            marginBottom: SPACING['M'],
          },
        }}
      >
        <Heading level={2} size="M" css={{ fontWeight: '700' }}>
          This is an in progress development site
        </Heading>
        <p>
          You can visit our current website at{' '}
          <Link to="https://www.lib.umich.edu">lib.umich.edu</Link>.
        </p>
        <List type="bulleted">
          <li>
            <Link to="/release-notes">View release notes</Link>
          </li>
          <li>
            <Link to="https://umlib.us/wr-qc">Send questions and comments</Link>{' '}
            to the website redesign team
          </li>
        </List>
        {noMouseDay && <A11yMessage />}

        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            '> *': {
              marginRight: SPACING['S'],
            },
          }}
        >
          <Button onClick={() => close()} ref={buttonRef}>
            Continue
          </Button>
          <span>or</span>
          <span>
            <Link to="https://www.lib.umich.edu/">lib.umich.edu</Link>
          </span>
        </div>
      </DialogContent>
    </DialogOverlay>
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
