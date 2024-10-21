import {
  Button,
  createSlug,
  Heading,
  Icon,
  Margins,
  MEDIA_QUERIES,
  SPACING
} from '../../reusable';
import { displayHours } from '../../utils/hours';
import HoursTable from '../hours-table';
import Html from '../html';
import PropTypes from 'prop-types';
import React from 'react';
import { useStateValue } from '../use-state';

const dateFormat = (string, abbreviated = false) => {
  if (abbreviated) {
    return string.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  }
  return string.toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric'
  });
};

export const HoursPanelNextPrev = ({ location }) => {
  const [{ weekOffset }, dispatch] = useStateValue();
  const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const fromDate = new Date(date);
  fromDate.setDate(date.getDate() + (weekOffset * 7) - date.getDay());

  const toDate = new Date(date);
  toDate.setDate(date.getDate() + (weekOffset * 7) + (6 - date.getDay()));

  const hoursRange = {
    label: `Showing hours for ${location} from ${dateFormat(fromDate)} to ${dateFormat(toDate)}`,
    text: `${dateFormat(fromDate, true)} - ${dateFormat(toDate, true)}`
  };

  return (
    <Margins data-hours-panel-next-previous>
      <div
        css={{
          alignItems: 'baseline',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: SPACING.L,
          marginTop: SPACING.L,
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
};

HoursPanelNextPrev.propTypes = {
  location: PropTypes.string
};

const IconWrapper = (props) => {
  return (
    <span
      css={{
        display: 'inline-block',
        marginTop: '-2px'
      }}
      {...props}
    />
  );
};

const PreviousNextWeekButton = ({ type, children, ...rest }) => {
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
};

PreviousNextWeekButton.propTypes = {
  children: PropTypes.string,
  type: PropTypes.string
};

/*
 *Return
 *
 *[
 *  'General',
 *  '24 hours',
 *  '10am - 5pm'
 *]
 */
const getRow = (node, nowWithWeekOffset, isParent) => {
  let hours = [];
  const notAvailableRow = { label: 'Not available', text: 'n/a' };
  const rowHeadingText = [isParent ? 'Main hours' : node.title];
  const mainHoursRow = {
    label: rowHeadingText,
    text: rowHeadingText,
    to: node.fields.slug
  };

  for (let iterator = 0; iterator < 7; iterator += 1) {
    const now = new Date(nowWithWeekOffset);

    now.setDate(nowWithWeekOffset.getDate() + (iterator - nowWithWeekOffset.getDay()));
    const display = displayHours({
      node,
      now
    });
    hours = hours.concat(display || notAvailableRow);
  }

  return [mainHoursRow].concat(hours);
};

const transformTableData = ({ node, now }) => {
  const { field_cards: fieldCards, field_parent_card: fieldParentCard } = node.relationships;

  /*
   *[
   *  {
   *    text: 'Sun',
   *    subtext: 'Apr 15',
   *    label: 'Sunday, April 15th'
   *  },
   *  ...
   *  {
   *    text: 'Sat',
   *    subtext: 'Apr 21',
   *    label: 'Saturday, April 21th'
   *  },
   *]
   */
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date(now);
  // Set to Sunday
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  const headings = [];

  for (let iterator = 0; iterator < 7; iterator += 1) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + iterator);

    headings.push({
      label: date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        weekday: 'long'
      }),
      subtext: date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short'
      }),
      text: daysOfWeek[date.getDay()]
    });
  }

  const sortByTitle = (sortA, sortB) => {
    const titleA = sortA.title.toUpperCase();
    const titleB = sortB.title.toUpperCase();

    if (titleA < titleB) {
      return -1;
    }

    if (titleA > titleB) {
      return 1;
    }

    return 0;
  };

  const rows = [
    getRow(fieldParentCard[0], now, true),
    ...fieldCards.sort(sortByTitle).map((nodeMap) => {
      return getRow(nodeMap, now);
    })
  ];

  return {
    headings,
    rows
  };
};

export default function HoursPanelContainer ({ data }) {
  const [{ weekOffset }] = useStateValue();
  const { relationships, field_body: fieldBody } = data;

  if (relationships.field_parent_card.length === 0) {
    return null;
  }

  const [{ title }] = relationships.field_parent_card;

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
          level={2}
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
