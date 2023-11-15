import React from 'react';
import {
  Margins,
  Heading,
  SPACING,
  Button,
  Icon,
  MEDIA_QUERIES,
  createSlug
} from '../../reusable';
import Html from '../html';
import HoursTable from '../hours-table';
import { useStateValue } from '../use-state';
import { displayHours } from '../../utils/hours';
import PropTypes from 'prop-types';

const dateFormat = (string, abbreviated = false) => {
  if (abbreviated) {
    return string.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
  return string.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export function HoursPanelNextPrev ({ location }) {
  const [{ weekOffset }, dispatch] = useStateValue();
  const date = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });

  const fromDate = new Date(date);
  fromDate.setDate(date.getDate() + (weekOffset * 7) - date.getDay());

  const toDate = new Date(date);
  toDate.setDate(date.getDate() + (weekOffset * 7) + (6 - date.getDay()));

  const hoursRange = {
    text: `${dateFormat(fromDate, true)} - ${dateFormat(toDate, true)}`,
    label: `Showing hours for ${location} from ${dateFormat(fromDate)} to ${dateFormat(toDate)}`
  };

  return (
    <Margins data-hours-panel-next-previous>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: SPACING.L,
          marginBottom: SPACING.L,
          position: 'sticky',
          top: 0
        }}
      >
        <PreviousNextWeekButton
          onClick={() => {
            return dispatch({
              type: 'setWeekOffset',
              weekOffset: weekOffset - 1
            });
          }}
          type='previous'
        >
          Previous week
        </PreviousNextWeekButton>
        <Heading
          aria-live='polite'
          aria-atomic='true'
          level={2}
          size='S'
          css={{
            fontWeight: '700'
          }}
        >
          <span className='visually-hidden'>
            {hoursRange.label}
          </span>
          <span aria-hidden>
            {hoursRange.text}
          </span>
        </Heading>
        <PreviousNextWeekButton
          onClick={() => {
            return dispatch({
              type: 'setWeekOffset',
              weekOffset: weekOffset + 1
            });
          }}
          type='next'
        >
          Next week
        </PreviousNextWeekButton>
      </div>
    </Margins>
  );
}

HoursPanelNextPrev.propTypes = {
  location: PropTypes.string
};

function IconWrapper (props) {
  return (
    <span
      css={{
        display: 'inline-block',
        marginTop: '-2px'
      }}
      {...props}
    />
  );
}

function PreviousNextWeekButton ({ type, children, ...rest }) {
  return (
    <>
      <Button
        {...rest}
        kind='subtle'
        css={{
          display: 'none',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'flex'
          }
        }}
      >
        {type === 'previous' && (
          <IconWrapper>
            <Icon
              icon='navigate_before'
              css={{ marginRight: SPACING['2XS'] }}
            />
          </IconWrapper>
        )}
        {children}
        {type === 'next' && (
          <IconWrapper>
            <Icon icon='navigate_next' css={{ marginLeft: SPACING['2XS'] }} />
          </IconWrapper>
        )}
      </Button>
      <Button
        {...rest}
        kind='subtle'
        css={{
          display: 'flex',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'none'
          }
        }}
      >
        <IconWrapper>
          <Icon icon={type === 'previous' ? 'navigate_before' : 'navigate_next'} />
        </IconWrapper>
        <span className='visually-hidden'>{children}</span>
      </Button>
    </>
  );
}

PreviousNextWeekButton.propTypes = {
  type: PropTypes.string,
  children: PropTypes.string
};

export default function HoursPanelContainer ({ data }) {
  const [{ weekOffset }] = useStateValue();
  const { relationships, field_body: fieldBody } = data;

  if (relationships.field_parent_card.length === 0) {
    return null;
  }

  const { title } = relationships.field_parent_card[0];

  return (
    <section
      data-hours-panel
      id={createSlug(title)}
      css={{
        marginBottom: SPACING['4XL']
      }}
    >
      <HoursPanelNextPrev location={title} />
      <Margins>
        <Heading
          level={3}
          size='L'
          css={{
            fontWeight: '700',
            marginBottom: SPACING['2XS']
          }}
        >
          {title}
        </Heading>
        {fieldBody && <Html html={fieldBody.processed} />}
        <HoursTable
          data={transformTableData({
            node: data,
            now: new Date(new Date().setDate(new Date().getDate() + weekOffset * 7))
          })}
          dayOfWeek={weekOffset === 0 ? new Date().getDay() : false}
          location={title}
        />
      </Margins>
    </section>
  );
}

HoursPanelContainer.propTypes = {
  data: PropTypes.object
};

function transformTableData ({ node, now }) {
  const { field_cards: fieldCards, field_parent_card: fieldParentCard } = node.relationships;

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
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date(now);
  // set to Sunday
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  const headings = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);

    headings.push({
      text: daysOfWeek[date.getDay()],
      subtext: date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      label: date.toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })
    });
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

  function sortByTitle (a, b) {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();

    if (titleA < titleB) {
      return -1;
    }

    if (titleA > titleB) {
      return 1;
    }

    return 0;
  }

  const rows = [
    getRow(fieldParentCard[0], now, true),
    ...fieldCards.sort(sortByTitle).map((n) => {
      return getRow(n, now);
    })
  ];

  return {
    headings,
    rows
  };
}

/*
  Return

  [
    'General',
    '24 hours',
    '10am - 5pm'
  ]
*/
function getRow (node, nowWithWeekOffset, isParent) {
  let hours = [];
  const notAvailableRow = { text: 'n/a', label: 'Not available' };
  const rowHeadingText = [isParent ? 'Main hours' : node.title];
  const mainHoursRow = {
    text: rowHeadingText,
    label: rowHeadingText,
    to: node.fields.slug
  };

  for (let i = 0; i < 7; i++) {
    const now = new Date(nowWithWeekOffset);

    now.setDate(nowWithWeekOffset.getDate() + (i - nowWithWeekOffset.getDay()));
    const display = displayHours({
      node,
      now
    });
    hours = hours.concat(display || notAvailableRow);
  }

  return [mainHoursRow].concat(hours);
}
