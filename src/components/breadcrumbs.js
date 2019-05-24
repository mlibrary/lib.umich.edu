import React from 'react'
import {
  SPACING,
  Icon,
  MEDIA_QUERIES
} from '@umich-lib/core'
import Link from '../components/link'

const Breadcrumbs = ({ data }) => {
  if (!Array.isArray(data)) {
    return null
  }

  // Get the second to last item. It's the parent.
  const parent = data.length >= 2 ? data[data.length - 2] : undefined

  return (
    <nav aria-label="breadcrumb">
      <ul css={{
        display: 'none',
        [MEDIA_QUERIES.LARGESCREEN]: {
          display: 'block'
        }
      }}>
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
      {parent && (
        <span css={{
          display: 'inline',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'none'
          }
        }}
        >
          <Icon icon="navigate_before" size={16} />
          <Link to={parent.to}>
            {parent.text}
          </Link>
        </span>
      )}
    </nav>
  )
}

export default Breadcrumbs