import React from 'react';
import { startOfWeek, addWeeks, format, endOfWeek, getDay, setDay} from 'date-fns';
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

const dateFormat = (string, abbreviated = false) => {
  if (abbreviated) {
    return format(string, 'MMM d');
  }
  return format(string, 'EEEE, MMMM d, yyyy');
};

export function HoursPanelNextPrev({ location }) {
  const [{ weekOffset }, dispatch] = useStateValue();

  const from_date = startOfWeek(addWeeks(new Date(), weekOffset));
  const to_date = endOfWeek(addWeeks(new Date(), weekOffset));

  const hoursRange = {
    text: `${dateFormat(from_date, true)} - ${dateFormat(to_date, true)}`,
    label: `Showing hours for ${location} from ${dateFormat(from_date)} to ${dateFormat(to_date)}`,
  };

  return (
    <Margins data-hours-panel-next-previous>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: SPACING['L'],
          marginBottom: SPACING['L'],
          position: 'sticky',
          top: 0,
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
  );
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
  );
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
        <span className='visually-hidden'>{children}</span>
      </Button>
    </React.Fragment>
  );
}

export default function HoursPanelContainer({ data }) {
  const [{ weekOffset }] = useStateValue();
  const { relationships, field_body } = data;

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
            marginBottom: SPACING['2XS'],
          }}
        >
          {title}
        </Heading>
        {field_body && <Html html={field_body.processed} />}
        <HoursTable
          data={transformTableData({
            node: data,
            now: addWeeks(new Date(), weekOffset),
          })}
          dayOfWeek={weekOffset === 0 ? getDay(new Date()) : false}
          location={title}
        />
      </Margins>
    </section>
  );
}

function transformTableData({ node, now }) {
  const { field_cards, field_parent_card } = node.relationships;

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
  let headings = [];
  for (let i = 0; i < 7; i++) {
    headings = headings.concat({
      text: format(setDay(now, i), 'EEE'),
      subtext: format(setDay(now, i), 'MMM d'),
      label: format(setDay(now, i), 'EEEE, MMMM d'),
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

  function sortByTitle(a, b) {
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
    getRow(field_parent_card[0], now, true),
    ...field_cards.sort(sortByTitle).map((n) => getRow(n, now)),
  ];

  return {
    headings,
    rows,
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
function getRow(node, nowWithWeekOffset, isParent) {
  let hours = [];
  const notAvailableRow = { text: 'n/a', label: 'Not available' };
  const rowHeadingText = [isParent ? 'Main hours' : node.title];
  const mainHoursRow = {
    text: rowHeadingText,
    label: rowHeadingText,
    to: node.fields.slug,
  };

  for (let i = 0; i < 7; i++) {
    const now = setDay(new Date(nowWithWeekOffset), i);

    const display = displayHours({
      node,
      now,
    });

    hours = hours.concat(display ? display : notAvailableRow);
  }

  return [mainHoursRow].concat(hours);
}
