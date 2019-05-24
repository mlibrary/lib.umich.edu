import React from 'react'
import {
  SPACING,
  Icon
} from '@umich-lib/core'
import Link from '../components/link'

const Breadcrumbs = ({ data }) => {
  if (!Array.isArray(data)) {
    return null
  }

  return (
    <nav aria-label="breadcrumb">
      <ul>
        {data.map(({text, to}, i) => (
          <li css={{
            display: 'inline-block',
            marginRight: SPACING['2XS']
          }} key={text + i}>
            {i > 0 && (<span css={{
              marginRight: SPACING['2XS']
            }}><Icon icon="navigate_next" size={16} /></span> )}
            {to ? (<Link to={to}>{text}</Link>) : (<React.Fragment>{text}</React.Fragment>)}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Breadcrumbs