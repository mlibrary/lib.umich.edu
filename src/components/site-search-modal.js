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
        width: `calc(100% - ${SPACING['M']} * 2)`,
        padding: `${SPACING['M']} ${SPACING['M']} `,
        margin: SPACING['M'],
        ...Z_SPACE['16'],
        [MEDIA_QUERIES['M']]: {
          borderRadius: '2px',
          width: '82vw',
          margin: '7vh auto',
        },
      }}
    >
      <SiteSearch label="Search this site" />
    </Dialog>
  )
}

export default SiteSearchModal
