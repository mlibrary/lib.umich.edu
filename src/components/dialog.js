import React from 'react'
import { Dialog, DialogContent, DialogOverlay } from '@reach/dialog'
import { Z_SPACE } from '@umich-lib/core'

import '@reach/dialog/styles.css'

function StyledDialog(props) {
  return (
    <DialogOverlay
      css={{
        borderRadius: '2px',
        ...Z_SPACE[16],
      }}
      {...props}
    />
  )
}

export { DialogContent, StyledDialog as DialogOverlay }
