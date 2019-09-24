import React, { useState } from 'react'
import {
  SPACING,
  Icon,
  TextInput,
  Button,
  Z_SPACE,
  Margins,
  MEDIA_QUERIES,
  COLORS
} from '@umich-lib/core'
import VisuallyHidden from '@reach/visually-hidden'
import { DialogOverlay, DialogContent } from "@reach/dialog"

import "@reach/dialog/styles.css"

function SiteSearch() {
  const [open, setOpen] = useState(false)

  return (
    <React.Fragment>
      <div
        role="search"
        aria-label="Sitewide"
      >
        <Button
          type="submit"
          kind="primary"
          onClick={() => setOpen(true)}
        >
          <span css={{
            height: '100%'
          }}>
            <Icon icon="search" size={20} />
          </span>
          <VisuallyHidden>Search this site</VisuallyHidden>
        </Button>
      </div>
      <DialogOverlay
        isOpen={open}
        onDismiss={() => setOpen(false)}
        css={{
          '[data-reach-dialog-content]': {
            borderRadius: '2px',
            width: '100%',
            ...Z_SPACE[16],
            [MEDIA_QUERIES.LARGESCREEN]: {
              maxWidth: '66%'
            },
            padding: SPACING['S'],
            'input': {
              padding: `${SPACING['S']} ${SPACING['M']}`,
              fontSize: '1.2rem',
              boxShadow: 'none',
              border: 'none'
            }
          }
        }}
      >
        <Margins>
          <DialogContent>
            <div css={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <span css={{
                height: '100%',
                padding: `${SPACING['S']} ${SPACING['M']}`
              }}>
                <Icon icon="search" size={24} />
              </span>
              <TextInput
                id="site-search"
                labelText="Search this site"
                type="search"
                hideLabel
                name="query"
                placeholder="Search this site"
                autoComplete="off"
                onClick={() => setOpen(true)}
              />
              <Button
                type="submit"
                kind="subtle"
                onClick={() => setOpen(false)}
                css={{
                  padding: `${SPACING['S']} ${SPACING['M']}`,
                  marginLeft: SPACING['S'],
                }}
              >
                <Icon icon="close" size={24} />
                <VisuallyHidden>Close</VisuallyHidden>
              </Button>
            </div>
          </DialogContent>
        </Margins>
      </DialogOverlay>
    </React.Fragment>
  )
}

export default SiteSearch