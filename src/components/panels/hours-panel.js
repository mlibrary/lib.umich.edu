import {
  Button,
  createSlug,
  Heading,
  Icon,
  Margins,
  MEDIA_QUERIES,
  SPACING
} from '../../reusable';
import React, { useState } from 'react';
import { displayHours } from '../../utils/hours';
import HoursTable from '../hours-table';
import Html from '../html';
import PropTypes from 'prop-types';
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

const CalendarView = () => {
  const [currentBrowseDate, setCurrentDate] = useState(new Date());
  const [, dispatch] = useStateValue();

  const handleNextMonth = () => {
    const nextMonth = new Date(currentBrowseDate.setMonth(currentBrowseDate.getMonth() + 1));
    setCurrentDate(new Date(nextMonth.setDate(1)));
  };

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentBrowseDate.setMonth(currentBrowseDate.getMonth() - 1));
    setCurrentDate(new Date(prevMonth.setDate(1)));
  };

  const getColorBasedOnDate = (date1) => {
    const currentDate = new Date();
    const startOfDay = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const startOfWeek = (date) => {
      const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - dayOfWeek);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const day1 = startOfDay(date1);
    const day2 = startOfDay(currentDate);

    // Check if it's the same day
    if (day1.getTime() === day2.getTime()) {
      return 'var(--color-maize-400)';
    }

    // Check if it's the same week
    const weekStart1 = startOfWeek(date1);
    const weekStart2 = startOfWeek(currentDate);

    if (weekStart1.getTime() === weekStart2.getTime()) {
      return 'var(--color-maize-100)';
    }

    return 'var(--color-blue-100)';
  };

  const getDaysInMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];

    const currentDayIterator = new Date(startOfMonth);
    while (currentDayIterator <= endOfMonth) {
      days.push(new Date(currentDayIterator));
      currentDayIterator.setDate(currentDayIterator.getDate() + 1);
    }

    return days;
  };

  const getCalendarDays = () => {
    const days = getDaysInMonth(currentBrowseDate);
    const firstDayOfMonth = new Date(days[0]);
    const lastDayOfMonth = new Date(days[days.length - 1]);

    const daysBefore = Array.from(
      { length: firstDayOfMonth.getDay() },
      (_, i) => {
        return new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), i - firstDayOfMonth.getDay() + 1);
      }
    );

    const daysAfter = Array.from(
      { length: 6 - lastDayOfMonth.getDay() },
      (_, i) => {
        return new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate() + i + 1);
      }
    );

    return [...daysBefore, ...days, ...daysAfter];
  };

  const calendarDays = getCalendarDays();
  const monthYear = currentBrowseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <button
          onClick={handlePreviousMonth}
          css={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5em'
          }}
        >
          ◀
        </button>
        <h2 css={{ margin: 0, fontSize: '1.5em' }}>{monthYear}</h2>
        <button
          onClick={handleNextMonth}
          css={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5em'
          }}
        >
          ▶
        </button>
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginTop: '8px',
          fontWeight: 'bold'
        }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
          return (
            <div
              css={{
                paddingLeft: '10px',
                paddingRight: '10px'
              }}
              key={day}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateRows: `repeat(${weeks.length}, auto)`,
          gap: '4px',
          marginTop: '8px'
        }}
      >
        {weeks.map((week, weekIndex) => {
          return (
            <a
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: 'setWeekOffset',
                  weekOffset: weekIndex
                });
              }}
              key={weekIndex}
              css={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
                textDecoration: 'none',
                border: `2px solid var(--color-maize-400)`
              }}
            >
              {week.map((day, dayIndex) => {
                return (
                  <div
                    key={dayIndex}
                    css={{
                      padding: '14px',
                      textAlign: 'center',
                      backgroundColor: getColorBasedOnDate(day),
                      borderRadius: '4px',
                      color: day.getMonth() !== currentBrowseDate.getMonth() ? '#999' : 'inherit'
                    }}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </a>
          );
        })}
      </div>
    </div>
  );
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
      <CalendarView></CalendarView>
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
