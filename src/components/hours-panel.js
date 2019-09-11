import React, { useState, useEffect } from 'react'
import { Margins, Heading, SPACING, Button, Icon } from '@umich-lib/core'
import * as moment from 'moment'

import VisuallyHidden from '@reach/visually-hidden'
import { displayHours } from '../utils/hours'
import HoursTable from './hours-table'

import {
  useStateValue
} from './use-state'

export function HoursPanelNextPrev() {
  const [{ weekOffset }, dispatch] = useStateValue()
  const from_date = moment().add(weekOffset, 'weeks').startOf('week');
  const to_date = moment().add(weekOffset, 'weeks').endOf('week');

  return (
    <Margins 
      data-hours-panel-next-previous
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: SPACING['L'],
          marginBottom: SPACING['L'],
          '> *:not(:last-of-type)': {
            marginRight: SPACING['M'],
          },
        }}
      >
        <Button
          onClick={() => dispatch({
            type: 'setWeekOffset',
            weekOffset: weekOffset + 1
          })}
          kind="subtle"
        >
          <Icon icon="navigate_before" css={{ marginRight: SPACING['2XS'] }} /> Previous week
        </Button>
        <Heading level={2} size="S" css={{ fontWeight: '700' }}>
          <span aria-live="polite" aria-atomic="true">
            <VisuallyHidden>Showing shours for </VisuallyHidden>
            {from_date.format('MMM D')} - {to_date.format('MMM D')}
          </span>
          </Heading>
        <Button
          onClick={() => dispatch({
            type: 'setWeekOffset',
            weekOffset: weekOffset - 1
          })}
          kind="subtle"
        >
          Next week <Icon icon="navigate_next" css={{ marginLeft: SPACING['2XS'] }} />
        </Button>
      </div>
    </Margins>
  )
}

export default function HoursPanelContainer({ data }) {
  const [initialized, setInitialized] = useState(false)
  const [{ weekOffset }] = useStateValue()

  useEffect(() => {
    setInitialized(true)
  }, [initialized])

  if (!initialized) {
    return null
  }

  const { relationships } = data

  if (relationships.field_parent_card.length === 0) {
    return null
  }

  const { title } = relationships.field_parent_card[0]

  return (
    <div data-hours-panel>
      <HoursPanelNextPrev />
      <Margins>
        <HoursPanel
          title={title}
          isCurrentWeek={weekOffset === 0}
          tableData={transformTableData({
            node: data,
            now: moment().add(weekOffset, 'weeks'),
          })}
        />
      </Margins>
    </div>
  )
}

function HoursPanel({ title, tableData = {}, isCurrentWeek }) {
  return (
    <section
      css={{
        marginTop: SPACING['L'],
        marginBottom: SPACING['4XL'],
      }}
    >
      <Heading
        level={2}
        size="L"
        css={{
          fontWeight: '700',
          marginBottom: SPACING['2XL'],
        }}
      >
        {title}
      </Heading>
      <HoursTable data={tableData} highlightToday={isCurrentWeek} />
    </section>
  )
}

function transformTableData({ node, now }) {
  const { field_cards, field_parent_card } = node.relationships

  /*
    [
      {
        text: 'Sun',
        subtext: 'Apr 15'
      },
      ...
      {
        text: 'Sat',
        subtext: 'Apr 21'
      },
    ]
  */
  let headings = []

  for (let i = 0; i < 7; i++) {
    headings = headings.concat({
      text: now.day(i).format('ddd'),
      subtext: now.day(i).format('MMM D'),
    })
  }

  /*
    Make the rows.
      1. title (th[scope="row"])
      2-n. The hours.

    [
      [
        'General',
        '24 hours',
        ...
      ]
    ]
  */
  const rows = [
    getRow(field_parent_card[0], now, true),
    ...field_cards.map(n => getRow(n, now)),
  ]

  return {
    headings,
    rows,
  }

  const dummyData = {
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

  return dummyData
}

/*
  Return

  [
    'General',
    '24 hours',
    '10am - 5pm'
  ]
*/
function getRow(node, nowWithWeekOffset, isParent) {
  let hours = []

  for (let i = 0; i < 7; i++) {
    const now = moment(nowWithWeekOffset).day(i)
    const display = displayHours({
      node,
      now,
    })

    hours = hours.concat(display ? display : 'n/a')
  }

  return [isParent ? 'General' : node.title].concat(hours)
}