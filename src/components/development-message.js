import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { Heading, SPACING, Button, List, Icon, MEDIA_QUERIES } from '@umich-lib/core'

import Dialog from './dialog'
import Link from './link'

const ACCESSIBILITY_MODE = process.env.GATSBY_ACCESSIBILITY_MODE === 'true'

export default function DevelopmentMessage() {
  const [cookies, setCookie] = useCookies()
  const defaultShowDialog = cookies['hide-lib-umich-msg'] ? false : true
  const [noMouseDay, setNoMouseDay] = useState(false)
  const [showDialog, setShowDialog] = React.useState(defaultShowDialog)

  useEffect(() => {
    if (ACCESSIBILITY_MODE) {
      let date = new Date()
      let dayOfWeek = date.getDay()

      if (dayOfWeek === 1) {
        setNoMouseDay(true)
      }
    }
  }, [])

  const close = () => {
    setCookie('hide-lib-umich-msg', 'true', { maxAge: 86400 })
    setShowDialog(false)
  }

  return (
    <Dialog
      isOpen={showDialog}
      aria-labelledby="dev-msg-heading"
      css={{
        position: 'relative',
      }}
    >
      <div
        css={{
          '> *:not(:last-child)': {
            marginBottom: SPACING['M'],
          },
        }}
      >
        <Button css={{
          position: 'absolute',
          top: '0',
          right: '0',
          lineHeight:  '0',
          padding: SPACING['S'],
          margin: SPACING['S']
        }} kind="reset" onClick={() => close()}><Icon title="Dismiss" icon="close" /></Button>
        <Heading level={2} size="M" id="dev-msg-heading" css={{ fontWeight: '700', marginRight: SPACING['XL'] }}>
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
            '> *': {
              display: 'block',
              marginBottom: SPACING['S'],
            },
            [MEDIA_QUERIES.LARGESCREEN]: {
              display: 'flex',
              alignItems: 'center',
              '> *': {
                margin: 0,
                marginRight: SPACING['S'],
              },
            },
            paddingTop: SPACING['S'],
          }}
        >
          <Button onClick={() => close()}>
            Continue
          </Button>
          <span>or</span>
          <span>
            <Link to="https://www.lib.umich.edu/">lib.umich.edu</Link>
          </span>
        </div>
      </div>
    </Dialog>
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
