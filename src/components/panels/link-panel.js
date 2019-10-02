import React from 'react'
import {
  SPACING,
  Heading
} from '@umich-lib/core'
import Link from '../link'

export default function LinkPanel({ data }) {
  const {
    field_title,
    field_link
  } = data
  return (
    <section>
      <Heading level={2} size="XL">{field_title}</Heading>
      <ol css={{
        maxWidth: '24rem',
        columns: '2',
        columnGap: SPACING['XL'],
        marginTop: SPACING['L'],
        'li': {
          marginBottom: SPACING['S']
        }
      }}>
        {field_link.map((d, i) => (
          <li
            key={d.title + i}
          >
            <Link kind="list" to={d.uri}>{d.title}</Link>
          </li>
        ))}
        <li><Link kind="list-strong" to="https://search.lib.umich.edu/databases/browse">View all databases</Link></li>
      </ol>
    </section>
  )
}