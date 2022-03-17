import React, { useState } from 'react'
import { TYPOGRAPHY, COLORS, SPACING, Button, Icon } from '@reusable'

export default function HoursTableSmallscreens({
  data,
  headingId,
  dayOfWeek = false,
}) {
  const [show, setShow] = useState(false)
  const todayIndex = dayOfWeek !== false ? dayOfWeek + 1 : -1
  /*
    For small screens, we render each row
    as a table. Only show 1-n if user
    requests detailed hours.
  */
  const tables = show ? data.rows : [data.rows[0]]

  return (
    <>
      {tables.map((table, t) => (
        <table
          aria-labelledby={headingId}
          key={`hours-table-${t}`}
          css={{
            width: '100%',
            maxWidth: '38rem',
            textAlign: 'left',
            marginTop: SPACING['XS'],
            'caption, th, td': {
              padding: `${SPACING['2XS']} ${SPACING['XS']}`,
              paddingTop: `calc(${SPACING['2XS']} - 2px)`,
            },
            th: {
              width: '9rem',
            },
            'th, td': {
              border: 'solid 2px white',
              marginTop: '2px',
            },
            [`tr:nth-of-type(${todayIndex - 1})`]: {
              'th, td': {
                borderBottom: `solid 2px ${COLORS.maize['400']}`,
              },
            },
            [`tr:nth-of-type(${todayIndex})`]: {
              th: {
                borderLeft: `solid 2px ${COLORS.maize['400']}`,
              },
              td: {
                borderRight: `solid 2px ${COLORS.maize['400']}`,
              },
              'th, td': {
                borderTop: `solid 2px ${COLORS.maize['400']}`,
                borderBottom: `solid 2px ${COLORS.maize['400']}`,
              },
            },
          }}
        >
          <caption
            css={{
              textAlign: 'left',
              fontWeight: '600',
              background: COLORS.blue['100'],
              borderBottom: `solid 2px ${COLORS.neutral['100']}`,
            }}
          >
            {table[0].text}
          </caption>
          {data.headings.map((heading, i) => (
            <tr key={`day-${i}`}>
              <th scope="row" aria-current={i === todayIndex - 1}>
                <span
                  css={{
                    ...TYPOGRAPHY['3XS'],
                  }}
                >
                  {heading.text}
                </span>{' '}
                <span
                  css={{
                    color: COLORS.neutral['300'],
                  }}
                >
                  {heading.subtext}
                </span>
              </th>
              <HoursSlot isToday={i === todayIndex - 1}>
                {data.rows[t][i + 1].text}
              </HoursSlot>
            </tr>
          ))}
        </table>
      ))}

      {data.rows.length > 1 ? (
        <Button
          kind="subtle"
          aria-expanded={show}
          onClick={() => setShow(!show)}
          css={{
            marginTop: SPACING['S'],
          }}
        >
          <span
            css={{
              marginRight: SPACING['2XS'],
            }}
          >
            {show ? 'Hide detailed hours' : 'Show detailed hours'}
          </span>
          {show ? <Icon icon="expand_less" /> : <Icon icon="expand_more" />}
        </Button>
      ) : null}
    </>
  )
}

function HoursSlot({ children, isToday }) {
  if (isToday) {
    return (
      <>
        <td>{children}</td>
        <td
          css={{
            width: '4.5rem',
            textAlign: 'center',
            background: COLORS.maize['400'],
            fontWeight: '600',
            fontSize: '0.875rem',
            textTransform: 'uppercase',
          }}
        >
          Today
        </td>
      </>
    )
  }

  return <td colSpan="2">{children}</td>
}
