import React, { useState, useEffect } from 'react'

import { COLORS, MEDIA_QUERIES } from '@umich-lib/core'

export default function HoursTable({ data }) {
  const [todayIndex, setTodayIndex] = useState(-1)

  /*
    We don't want to SSR the hours table since that
    is dynamic to now. We can show the table, but
    not the "Today" highlight.
  */
  useEffect(() => {
    const today = new Date()
    setTodayIndex(today.getDay() + 2) // Add two. Sun is 0 and Sun starts as 2nd nth-child.
  }, [todayIndex])

  return (
    <table
      css={{
        width: '100%',
        marginTop: '2rem',
        textAlign: 'left',
        tableLayout: 'fixed',
        'th, td': {
          padding: '0.75rem',
          borderBottom: 'solid 1px #E5E9ED',
        },
        'tbody tr:first-of-type': {
          borderTop: 'solid 2px #E5E9ED',
          background: '#F7F8F9',
        },
        'tbody th': {
          fontWeight: '700',
        },
        [`th:nth-child(${todayIndex}), td:nth-child(${todayIndex})`]: {
          borderRight: 'solid 3px #FFCB05',
          borderLeft: 'solid 3px #FFCB05',
        },
        [`thead th:nth-child(${todayIndex})`]: {
          borderTop: 'solid 3px #FFCB05',
        },
        [`tbody > tr:last-child td:nth-child(${todayIndex})`]: {
          borderBottom: 'solid 3px #FFCB05',
        },
      }}
    >
      <thead>
        <tr>
          <th colspan="2" />
          {data.headings.map(({ text, subtext }, i) => (
            <th scope="col" aria-current={i + 2 === todayIndex}>
              <div
                css={{
                  position: 'relative',
                }}
              >
                {i + 2 === todayIndex && (
                  <span
                    css={{
                      position: 'absolute',
                      marginLeft: `calc(-0.75rem + -3px)`,
                      marginTop: `calc(-2rem + -6px)`,
                      display: `inline-block`,
                      padding: '0 0.5rem',
                      background: '#FFCB05',
                      borderRadius: '2px 2px 0 0',
                      fontWeight: '600',
                    }}
                    aria-hidden="true"
                  >
                    Today
                  </span>
                )}
                <span css={{ display: 'block', fontWeight: '700' }}>
                  {text}
                </span>
                <span css={{ colors: COLORS.neutral['300'] }}>{subtext}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map(row => (
          <tr>
            {row.map((col, i) => (
              <React.Fragment>
                {i === 0 ? (
                  <th scope="row" colspan="2">
                    {col}
                  </th>
                ) : (
                  <td>{col}</td>
                )}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
