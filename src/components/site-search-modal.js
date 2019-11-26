import React from 'react'
import { Dialog } from '@reach/dialog'
import { SPACING, Z_SPACE } from '@umich-lib/core'

import SiteSearch from './site-search'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'

function SiteSearchModal({ handleDismiss }) {
  return (
    <Dialog
      onDismiss={handleDismiss}
      css={{
        width: '100%',
        padding: SPACING['M'],
        margin: '0',
        ...Z_SPACE['16'],
        [MEDIA_QUERIES['M']]: {
          borderRadius: '2px',
          width: '67vw',
          padding: SPACING['L'],
          margin: '9vh auto',
        },
      }}
    >
      <SiteSearch />
    </Dialog>
  )
}

export default SiteSearchModal
