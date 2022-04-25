import React from 'react';
import { Dialog } from '@reach/dialog';
import { SPACING, Z_SPACE } from '@reusable';

import SiteSearch from './site-search';
import MEDIA_QUERIES from '../reusable/media-queries';

import '@reach/dialog/styles.css';

function SiteSearchModal({ handleDismiss }) {
  return (
    <React.Fragment>
      <Dialog
        aria-label="Search this site"
        onDismiss={handleDismiss}
        css={{
          '&[data-reach-dialog-content]': {
            width: `calc(100% - ${SPACING['M']} * 2)`,
            margin: SPACING['M'],
            padding: '0',
            ...Z_SPACE['16'],
            borderRadius: '2px',
            '[data-site-search-icon]': {
              left: SPACING['L'],
            },
            input: {
              padding: `${SPACING['S']} ${SPACING['L']}`,
              paddingLeft: `calc(${SPACING['XL']} + ${SPACING['L']})`,
              border: 'none',
            },
            [MEDIA_QUERIES['M']]: {
              width: '82vw',
              margin: `${SPACING['L']} auto`,
            },
            '[data-site-search-keyboard-instructions]': {
              display: 'none',
            },
          },
        }}
      >
        <SiteSearch label="Search this site" />
      </Dialog>
    </React.Fragment>
  );
}

export default SiteSearchModal;
