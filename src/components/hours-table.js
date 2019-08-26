import React, { useState, useEffect } from 'react'

import { COLORS } from '@umich-lib/core'

const data = {
  headings: [
    {
      text: 'Sun',
      subtext: 'Apr 15',
    },
    {
      text: 'Mon',
      subtext: 'Apr 16',
    },
    {
      text: 'Tue',
      subtext: 'Apr 17',
    },
    {
      text: 'Wed',
      subtext: 'Apr 18',
    },
    {
      text: 'Thu',
      subtext: 'Apr 19',
    },
    {
      text: 'Fri',
      subtext: 'Apr 20',
    },
    {
      text: 'Sat',
      subtext: 'Apr 21',
    },
  ],
  rows: [
    [
      'General',
      '24 hours',
      '24 hours',
      '24 hours',
      '24 hours',
      '24 hours',
      '24 hours',
      '24 hours',
    ],
    [
      'Computer and Video Game Archive',
      'Closed',
      '10am - 8pm',
      '10am - 8pm',
      '10am - 8pm',
      '10am - 8pm',
      '10am - 8pm',
      'Closed',
    ],
  ],
}

export default function HoursTable() {
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
          <th />
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
                      marginTop: `calc(-2rem + -7px)`,
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
                {i === 0 ? <th scope="row">{col}</th> : <td>{col}</td>}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
