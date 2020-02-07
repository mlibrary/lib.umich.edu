import React from 'react'
import { Dialog } from '@reach/dialog'
import { SPACING, Z_SPACE } from '@umich-lib/core'

import SiteSearch from './site-search'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'

function SiteSearchModal({ handleDismiss }) {
  return (
    <React.Fragment>
      <Dialog
        onDismiss={handleDismiss}
        css={{
          width: `calc(100% - ${SPACING['M']} * 2)`,
          margin: SPACING['M'],
          padding: '0',
          ...Z_SPACE['16'],
          borderRadius: '2px',
          '[data-site-search-icon]': {
            left: SPACING['L'],
          },
          '[data-reach-combobox-input]': {
            padding: `${SPACING['M']} ${SPACING['L']}`,
            paddingLeft: `calc(${SPACING['XL']} + ${SPACING['L']})`,
            border: 'none',
          },
          [MEDIA_QUERIES['M']]: {
            width: '82vw',
            margin: '7vh auto',
          },
        }}
      >
        <SiteSearch label="Search this site" />
      </Dialog>
    </React.Fragment>
  )
}

export default SiteSearchModal
