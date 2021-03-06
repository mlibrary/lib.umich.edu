import React, { useState, useEffect } from 'react'
import * as moment from 'moment'
import VisuallyHidden from '@reach/visually-hidden'
import {
  Margins,
  Heading,
  SPACING,
  Button,
  Icon,
  MEDIA_QUERIES,
} from '@reusable'

import HTML from '../html'
import HoursTable from '../hours-table'
import { useStateValue } from '../use-state'
import getTransitionCSS from '../../utils/transition'
import { displayHours } from '../../utils/hours'

export function HoursPanelNextPrev() {
  const [{ weekOffset }, dispatch] = useStateValue()
  const from_date = moment()
    .add(weekOffset, 'weeks')
    .startOf('week')
  const to_date = moment()
    .add(weekOffset, 'weeks')
    .endOf('week')

  const hoursRange = {
    text: `${from_date.format('MMM D')} - ${to_date.format('MMM D')}`,
    label: `Showing hours from ${from_date.format(
      'dddd, MMMM D, YYYY'
    )} to ${to_date.format('dddd, MMMM D, YYYY')}`,
  }

  return (
    <Margins data-hours-panel-next-previous>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: SPACING['L'],
          marginBottom: SPACING['L'],
        }}
      >
        <PreviousNextWeekButton
          onClick={() =>
            dispatch({
              type: 'setWeekOffset',
              weekOffset: weekOffset - 1,
            })
          }
          type="previous"
        >
          Previous week
        </PreviousNextWeekButton>
        <Heading level={2} size="S" css={{ fontWeight: '700' }}>
          <span
            aria-live="polite"
            aria-atomic="true"
            aria-label={hoursRange.label}
          >
            {hoursRange.text}
          </span>
        </Heading>
        <PreviousNextWeekButton
          onClick={() =>
            dispatch({
              type: 'setWeekOffset',
              weekOffset: weekOffset + 1,
            })
          }
          type="next"
        >
          Next week
        </PreviousNextWeekButton>
      </div>
    </Margins>
  )
}

function IconWrapper(props) {
  return (
    <span
      css={{
        display: 'inline-block',
        marginTop: '-2px',
      }}
      {...props}
    />
  )
}

function PreviousNextWeekButton({ type, children, ...rest }) {
  return (
    <React.Fragment>
      <Button
        {...rest}
        kind="subtle"
        css={{
          display: 'none',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'flex',
          },
        }}
      >
        {type === 'previous' && (
          <IconWrapper>
            <Icon
              icon="navigate_before"
              css={{ marginRight: SPACING['2XS'] }}
            />
          </IconWrapper>
        )}
        {children}
        {type === 'next' && (
          <IconWrapper>
            <Icon icon="navigate_next" css={{ marginLeft: SPACING['2XS'] }} />
          </IconWrapper>
        )}
      </Button>
      <Button
        {...rest}
        kind="subtle"
        css={{
          display: 'flex',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'none',
          },
        }}
      >
        <IconWrapper>
          {type === 'previous' ? (
            <Icon icon="navigate_before" />
          ) : (
            <Icon icon="navigate_next" />
          )}
        </IconWrapper>
        <VisuallyHidden>{children}</VisuallyHidden>
      </Button>
    </React.Fragment>
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

  const { relationships, field_body, id } = data

  if (relationships.field_parent_card.length === 0) {
    return null
  }

  const { title } = relationships.field_parent_card[0]
  const transitionCSS = getTransitionCSS()
  return (
    <section data-hours-panel css={transitionCSS}>
      <HoursPanelNextPrev />
      <Margins>
        <HoursPanel
          title={title}
          id={id}
          isCurrentWeek={weekOffset === 0}
          tableData={transformTableData({
            node: data,
            now: moment().add(weekOffset, 'weeks'),
          })}
        >
          {field_body && <HTML html={field_body.processed} />}
        </HoursPanel>
      </Margins>
    </section>
  )
}

function HoursPanel({ title, id, tableData = {}, isCurrentWeek, children }) {
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
          marginBottom: SPACING['2XS'],
        }}
        id={id}
      >
        {title}
      </Heading>
      {children}
      <HoursTable
        data={tableData}
        headingId={id}
        dayOfWeek={isCurrentWeek ? moment().day() : false}
      />
    </section>
  )
}

function transformTableData({ node, now }) {
  const { field_cards, field_parent_card } = node.relationships

  /*
    [
      {
        text: 'Sun',
        subtext: 'Apr 15',
        label: 'Sunday, April 15th'
      },
      ...
      {
        text: 'Sat',
        subtext: 'Apr 21',
        label: 'Saturday, April 21th'
      },
    ]
  */
  let headings = []

  for (let i = 0; i < 7; i++) {
    headings = headings.concat({
      text: now.day(i).format('ddd'),
      subtext: now.day(i).format('MMM D'),
      label: now.day(i).format('dddd, MMMM D'),
    })
  }

  /*
    Make the rows.
      1. title (th[scope="row"])
      2-n. The hours.

    [
      [
        { text: 'General', label: 'General' },
        { text: '24 hours', label: '24 hours' },
        ...
      ]
    ]
  */

  function sortByTitle(a, b) {
    const titleA = a.title.toUpperCase()
    const titleB = b.title.toUpperCase()

    if (titleA < titleB) {
      return -1
    }

    if (titleA > titleB) {
      return 1
    }

    return 0
  }

  const rows = [
    getRow(field_parent_card[0], now, true),
    ...field_cards.sort(sortByTitle).map(n => getRow(n, now)),
  ]

  return {
    headings,
    rows,
  }
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
  const notAvailableRow = { text: 'n/a', label: 'Not available' }
  const rowHeadingText = [isParent ? 'Main hours' : node.title]
  const mainHoursRow = { text: rowHeadingText, label: rowHeadingText }

  for (let i = 0; i < 7; i++) {
    const now = moment(nowWithWeekOffset).day(i)
    const display = displayHours({
      node,
      now,
    })

    hours = hours.concat(display ? display : notAvailableRow)
  }

  return [mainHoursRow].concat(hours)
}
