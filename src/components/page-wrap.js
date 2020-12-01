import React from 'react'
import SkipLinks from './skip-links'

export default function PageWrap({ element }) {
  return (
    <React.Fragment>
      <div
        css={{
          minHeight: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          gridTemplateColumns: '100%',
          'm-universal-header': {
            minHeight: '58px',
          },
        }}
      >
        <div>
          <SkipLinks />
          <m-universal-header></m-universal-header>
        </div>
        {element}
      </div>
      <m-chat id="chat"></m-chat>
    </React.Fragment>
  )
}
