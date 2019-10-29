import React from 'react'
import {
  Icon
} from '@umich-lib/core'

export default function IconText({ d, icon, children, ...rest }) {
  return (
    <span css={{ display: 'flex' }}>
      <span css={{
        width: '1.75rem',
        flexShrink: '0',
        marginTop: '-2px'
      }}>
        {d ? <Icon d={d} /> : <Icon icon={icon} />}
      </span>
      {children}
    </span>
  )
}