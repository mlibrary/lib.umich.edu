import React, { useState, useEffect } from 'react'

import { COLORS, SPACING } from '@umich-lib/core'

export default function HoursTable({ data, highlightToday = false }) {
  const [todayIndex, setTodayIndex] = useState(-1)

  /*
    We don't want to SSR the hours table since that
    is dynamic to now. We can show the table, but
    not the "Today" highlight.
  */
  useEffect(() => {
    if (highlightToday) {
      const today = new Date()
      setTodayIndex(today.getDay() + 2) // Add two. Sun is 0 and Sun starts as 2nd nth-child.
    } else {
      setTodayIndex(-1)
    }
  }, [highlightToday])

  return (
    <table
      css={{
        width: '100%',
        marginTop: SPACING['XL'],
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
        [`th:nth-of-type(${todayIndex}), td:nth-of-type(${todayIndex})`]: {
          borderRight: 'solid 2px #FFCB05',
          borderLeft: 'solid 2px #FFCB05',
        },
        [`thead th:nth-of-type(${todayIndex})`]: {
          borderTop: 'solid 2px #FFCB05',
        },
        [`tbody > tr:last-child td:nth-of-type(${todayIndex})`]: {
          borderBottom: 'solid 2px #FFCB05',
        },
      }}
    >
      <thead>
        <tr>
          <th colSpan="2" />
          {data.headings.map(({ text, subtext }, i) => (
            <th scope="col" aria-current={i + 2 === todayIndex} key={text + subtext + i}>
              <div
                css={{
                  position: 'relative',
                }}
              >
                {i + 2 === todayIndex && (
                  <span
                    css={{
                      position: 'absolute',
                      marginLeft: `calc(-0.75rem + -2px)`,
                      marginTop: `calc(-2rem + -2px)`,
                      display: `inline-block`,
                      padding: `0 ${SPACING['2XS']}`,
                      background: '#FFCB05',
                      borderRadius: '2px 2px 0 0',
                      fontWeight: '700',
                      fontSize: '0.875rem'
                    }}
                    aria-hidden="true"
                  >
                    TODAY
                  </span>
                )}
                <span css={{
                  display: 'block',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem'
                }}>
                  {text}
                </span>
                <span css={{ color: COLORS.neutral['300'] }}>{subtext}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, y) => (
          <tr key={row + y}>
            {row.map((col, i) => (
              <React.Fragment key={row + col + y + i}>
                {i === 0 ? (
                  <th scope="row" colSpan="2">
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
