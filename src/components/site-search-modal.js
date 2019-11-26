import React from 'react'
import { Dialog } from '@reach/dialog'
import { SPACING } from '@umich-lib/core'

import SiteSearch from './site-search'

function SiteSearchModal({ handleDismiss }) {
  return (
    <Dialog
      onDismiss={handleDismiss}
      css={{
        width: '100%',
        padding: SPACING['M'],
        margin: '0',
      }}
    >
      <SiteSearch />
    </Dialog>
  )
}

export default SiteSearchModal
