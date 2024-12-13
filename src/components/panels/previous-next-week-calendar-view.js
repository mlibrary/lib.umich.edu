import { Button, Heading, Icon, Link, Margins, MEDIA_QUERIES, SPACING } from '../../reusable';
import React, { useState } from 'react';
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

export default function HoursPanelDateViewer () {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  return (
    <div
      css={{
        background: 'var(--color-teal-100)',
        borderBottom: '1px solid var(--color-neutral-100)',
        borderTop: '1px solid var(--color-neutral-100)',
        marginBottom: SPACING.L,
        marginTop: SPACING.L,
        padding: SPACING['2XS'],
        position: 'sticky',
        top: '-1px',
        zIndex: 1
      }}
    >
      <HoursPanelNextPrev
        toggleCalendarVisibility={toggleCalendarVisibility}
        isCalendarVisible={isCalendarVisible}
      />
    </div>
  );
}

const CalendarView = ({ isVisible, weekOffset }) => {
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

  const startOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const getColorBasedOnDate = (date1) => {
    const currentDate = new Date();

    const startOfWeek = (date) => {
      const dayOfWeek = date.getDay();
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - dayOfWeek);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const day1 = startOfDay(date1);
    const day2 = startOfDay(currentDate);

    if (day1.getTime() === day2.getTime()) {
      return 'var(--color-maize-400)';
    }

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

    const daysBefore = Array.from({ length: firstDayOfMonth.getDay() }, (_, i) => {
      return new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), i - firstDayOfMonth.getDay() + 1);
    });

    const daysAfter = Array.from({ length: 6 - lastDayOfMonth.getDay() }, (_, i) => {
      return new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate() + i + 1);
    });

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
        alignItems: 'center',
        backgroundColor: 'var(--color-teal-100)',
        border: `1px solid var(--color-neutral-100)`,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        height: 'auto',
        left: '50%',
        marginLeft: '-160px',
        maxWidth: '320px',
        overflow: 'hidden',
        position: 'absolute',
        transition: 'height 0.3s ease',
        width: '100%',
        zIndex: 1
      }}
    >
      <div
        css={{
          alignItems: 'center',
          display: 'flex ',
          justifyContent: 'space-between',
          paddingTop: '15px',
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
          <Icon
            icon='navigate_before'
            css={{ marginLeft: SPACING.M }}
          />
        </button>
        <h2
          css={{
            fontSize: '1.5em',
            margin: 0
          }}
        >
          {monthYear}
        </h2>
        <button
          onClick={handleNextMonth}
          css={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5em'
          }}
        >
          <Icon
            icon='navigate_next'
            css={{ marginRight: SPACING.M }}
          />
        </button>
      </div>
      {isVisible && (
        <>
          <div
            css={{
              display: 'grid',
              fontWeight: 'bold',
              gridTemplateColumns: 'repeat(7, 1fr)',
              marginTop: '8px'
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
              return (
                <div
                  css={{
                    paddingLeft: '8px',
                    paddingRight: '8px'
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
              gap: '4px',
              gridTemplateRows: `repeat(${weeks.length}, auto)`,
              marginBottom: '8px',
              marginTop: '8px'
            }}
          >
            {weeks.map((week, weekIndex) => {
              return (
                <a
                  onClick={(event) => {
                    event.preventDefault();
                    dispatch({
                      type: 'setWeekOffset',
                      weekOffset: weekIndex - 1
                    });
                  }}
                  key={weekIndex}
                  css={{
                    border: week.some((day) => {
                      const viewedWeekStart = new Date(new Date().setDate(
                        new Date().getDate() + weekOffset * 7 - new Date().getDay()
                      ));
                      const weekStartDay = startOfDay(day);
                      const viewedWeekStartDay = startOfDay(viewedWeekStart);
                      return weekStartDay.getTime() === viewedWeekStartDay.getTime();
                    })
                      ? `2px solid var(--color-maize-400)`
                      : `2px solid rgba(0,0,0,0)`,
                    display: 'grid',
                    gap: '4px',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    textDecoration: 'none'
                  }}
                >
                  {week.map((day, dayIndex) => {
                    return (
                      <div
                        key={dayIndex}
                        css={{
                          backgroundColor: getColorBasedOnDate(day),
                          borderRadius: '4px',
                          color: day.getMonth() === currentBrowseDate.getMonth() ? 'inherit' : '#999',
                          padding: '10px',
                          textAlign: 'center'
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
        </>
      )}
    </div>
  );
};

CalendarView.propTypes = {
  isVisible: PropTypes.bool
};

const HoursPanelNextPrev = ({ location, toggleCalendarVisibility, isCalendarVisible }) => {
  const [{ weekOffset }, dispatch] = useStateValue();
  const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const fromDate = new Date(date);
  fromDate.setDate(date.getDate() + weekOffset * 7 - date.getDay());

  const toDate = new Date(date);
  toDate.setDate(date.getDate() + weekOffset * 7 + (6 - date.getDay()));

  const hoursRange = {
    label: `Showing hours for ${location} from ${dateFormat(fromDate)} to ${dateFormat(toDate)}`,
    text: `${dateFormat(fromDate, true)} - ${dateFormat(toDate, true)}`
  };

  return (
    <Margins
      data-hours-panel-next-previous
      css={{
        position: 'relative'
      }}
    >
      <div
        css={{
          alignItems: 'baseline',
          display: 'flex',
          justifyContent: 'space-between'

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
          onClick={toggleCalendarVisibility}
          css={{
            cursor: 'pointer',
            fontWeight: '700'
          }}
        >
          <span className='visually-hidden'>
            {hoursRange.label}
          </span>
          <span aria-hidden>
            {hoursRange.text}
          </span>
          <Icon
            width='32px'
            height='24px'
            css={{
              color: `var(--color-teal-400)`
            }}
            icon='calendar_month'
          />
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
      <div
        css={{
          position: 'relative'
        }}
      >
        <CalendarView isVisible={isCalendarVisible} weekOffset={weekOffset} />
      </div>
    </Margins>
  );
};

HoursPanelNextPrev.propTypes = {
  isCalendarVisible: PropTypes.bool.isRequired,
  location: PropTypes.string.isRequired,
  toggleCalendarVisibility: PropTypes.func.isRequired
};

const PreviousNextWeekButton = ({ type, children, ...rest }) => {
  return (
    <>
      <Link
        {...rest}
        css={{
          backgroundColor: 'rgba(0,0,0,0)',
          boxShadow: 'none',
          color: 'var(--color-teal-400)',
          display: 'none',
          fontWeight: 'bold',
          margin: '.5rem 0',
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
      </Link>
      <Link
        {...rest}
        css={{
          backgroundColor: 'rgba(0,0,0,0)',
          boxShadow: 'none',
          color: 'var(--color-teal-400)',
          display: 'flex',
          fontWeight: 'bold',
          margin: '.5rem 0',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'none'
          }
        }}
      >
        <IconWrapper>
          <Icon icon={type === 'previous' ? 'navigate_before' : 'navigate_next'} />
        </IconWrapper>
        <span className='visually-hidden'>{children}</span>
      </Link>
    </>
  );
};

PreviousNextWeekButton.propTypes = {
  children: PropTypes.string,
  type: PropTypes.string
};
