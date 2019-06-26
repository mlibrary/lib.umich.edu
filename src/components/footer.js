import React from 'react'

import {
  COLORS,
  SPACING,
  Margins
} from '@umich-lib/core'

function Footer() {
  return (
    <footer css={{
      minHeight: '14rem',
      background: COLORS['teal']['400']
    }}>

      <Margins>
        <div css={{
          color: 'white',
          padding: `${SPACING['2XL']} 0`
        }}>
          [Logo component here]
          <address css={{
            marginTop: SPACING['L']
          }}>
            <p>913 S. University Avenue<br/>Ann Arbor, MI 48109</p>
          </address>
        </div>
      </Margins>
    </footer>
  )
}

export default Footer