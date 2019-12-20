import React from 'react'
import { Dialog } from '@reach/dialog'
import { SPACING, Z_SPACE, Heading } from '@umich-lib/core'

import SiteSearch from './site-search'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'

function SiteSearchModal({ handleDismiss }) {
  return (
    <Dialog
      onDismiss={handleDismiss}
      css={{
        width: '100%',
        padding: `${SPACING['M']} ${SPACING['M']} `,
        margin: '0',
        ...Z_SPACE['16'],
        [MEDIA_QUERIES['M']]: {
          borderRadius: '2px',
          width: '67vw',
          padding: `${SPACING['L']} ${SPACING['XL']} `,
          margin: '9vh auto',
        },
      }}
    >
      <Heading
        size="S"
        level={2}
        css={{
          marginBottom: SPACING['XS'],
        }}
      >
        Search this site
      </Heading>
      <SiteSearch label={null} />
    </Dialog>
  )
}

export default SiteSearchModal
