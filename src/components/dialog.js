import React from 'react'
import { Dialog } from '@reach/dialog'
import { Z_SPACE, MEDIA_QUERIES, SPACING } from '@umich-lib/core'

import '@reach/dialog/styles.css'

export default function StyledDialog(props) {
  return (
    <Dialog
      css={{
        borderRadius: '2px',
        width: '90vw',
        [MEDIA_QUERIES.LARGESCREEN]: {
          width: '38rem'
        },
        ...Z_SPACE[16],
      }}
      {...props}
    />
  )
}
