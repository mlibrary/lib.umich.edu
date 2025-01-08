import { Heading, Icon, Link, Margins, MEDIA_QUERIES, SPACING, TYPOGRAPHY } from '../../reusable';
import React, { useEffect, useState } from 'react';
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

const updateWeekOffset = ({
  dispatch,
  weekOffset,
  event = null,
  week = null,
  relativeOffset = null
}) => {
  if (
    !event
    || event.type === 'click'
    || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))
  ) {
    if (event) {
      event.preventDefault();
    }

    let newOffset = weekOffset;

    if (relativeOffset !== null) {
      newOffset = weekOffset + relativeOffset;
    } else if (week) {
      const today = new Date();
      const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const selectedWeekStart = new Date(week[0]);

      newOffset = Math.round(
        (selectedWeekStart.getTime() - currentWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
    }

    dispatch({
      type: 'setWeekOffset',
      weekOffset: newOffset
    });
  }
};

export default function HoursPanelDateViewer () {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState('');

  const handleKeydown = (event) => {
    if (event.keyCode === 27) {
      setIsCalendarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.addEventListener('keydown', handleKeydown);
    };
  });

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible(!isCalendarVisible);
    setCalendarStatus(
      isCalendarVisible ? 'Calendar closed' : 'Calendar open'
    );
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
      <div
        aria-live='polite'
        aria-atomic='true'
        style={{
          clip: 'rect(0 0 0 0)',
          clipPath: 'inset(50%)',
          height: '1px',
          overflow: 'hidden',
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px'
        }}
      >
        {calendarStatus}
      </div>
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
  useEffect(() => {
    const today = new Date();
    const newBrowseDate = new Date(today.setDate(today.getDate() + weekOffset * 7));
    setCurrentDate(newBrowseDate);
  }, [weekOffset]);

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

    let currentDayIterator = new Date(startOfMonth);
    while (currentDayIterator <= endOfMonth) {
      days.push(new Date(currentDayIterator));
      currentDayIterator = new Date(currentDayIterator.setDate(currentDayIterator.getDate() + 1));
    }

    return days;
  };

  const getCalendarDays = () => {
    const days = getDaysInMonth(currentBrowseDate);
    const firstDayOfMonth = new Date(days[0]);
    const lastDayOfMonth = new Date(days[days.length - 1]);

    const daysBefore = Array.from({ length: firstDayOfMonth.getDay() }, (skip, iterator) => {
      return new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), iterator - firstDayOfMonth.getDay() + 1);
    });

    const daysAfter = Array.from({ length: 6 - lastDayOfMonth.getDay() }, (skip, iterator) => {
      return new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate() + iterator + 1);
    });

    return [...daysBefore, ...days, ...daysAfter];
  };

  const calendarDays = getCalendarDays();
  const monthYear = currentBrowseDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const month = currentBrowseDate.toLocaleString('default', { month: 'long' });

  const getMonthLong = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const weeks = [];
  for (let iterator = 0; iterator < calendarDays.length; iterator += 7) {
    weeks.push(calendarDays.slice(iterator, iterator + 7));
  }

  return isVisible
    ? (
        <div
          css={{
            alignItems: 'center',
            backgroundColor: 'var(--color-neutral-100)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: isVisible ? 'flex' : 'none',
            flexDirection: 'column',
            height: 'auto',
            left: '50%',
            marginLeft: '-160px',
            maxWidth: '320px',
            overflow: 'hidden',
            position: 'absolute',
            top: '5px',
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
                ...TYPOGRAPHY.M,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label='previous month'
            >
              <Icon
                icon='navigate_before'
                css={{ marginLeft: SPACING.M }}
              />
            </button>
            <h2
              aria-live='polite'
              css={{
                ...TYPOGRAPHY.M,
                margin: 0
              }}
            >
              {monthYear}
            </h2>
            <button
              onClick={handleNextMonth}
              css={{
                ...TYPOGRAPHY.M,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label='Next month'
            >
              <Icon
                icon='navigate_next'
                css={{ marginRight: SPACING.M }}
              />
            </button>
          </div>
          <>
            <div
              css={{
                display: 'grid',
                fontWeight: 'bold',
                gap: '4px',
                gridTemplateColumns: 'repeat(7, 1fr)',
                marginTop: '8px',
                paddingLeft: '12px',
                paddingRight: '12px',
                textAlign: 'center',
                width: '100%'
              }}
            >
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                return (
                  <div
                    css={{
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
                const currentWeek = week.some((day) => {
                  const viewedWeekStart = new Date(new Date().setDate(
                    new Date().getDate() + weekOffset * 7 - new Date().getDay()
                  ));
                  const weekStartDay = startOfDay(day);
                  const viewedWeekStartDay = startOfDay(viewedWeekStart);
                  return weekStartDay.getTime() === viewedWeekStartDay.getTime();
                });
                return (
                  <a
                    onClick={(event) => {
                      return updateWeekOffset({ dispatch, event, week, weekOffset });
                    }}
                    onKeyDown={(event) => {
                      return updateWeekOffset({ dispatch, event, week, weekOffset });
                    }}
                    tabIndex={0}
                    key={weekIndex}
                    aria-label={`${currentWeek ? 'This is the currently selected week.' : 'View '} week ${weekIndex + 1} in ${month} from ${getMonthLong(week[0])} ${week[0].getDate()} to ${getMonthLong(week[week.length - 1])} ${week[week.length - 1].getDate()}`}
                    css={{
                      border: currentWeek
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
            <p css={{ color: `var(--color-neutral-300);` }}>
              <span css={{ background: 'white',
                border: `solid 1px var(--color-neutral-200)`,
                borderRadius: '4px',
                boxShadow: `0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;`,
                display: 'inline-block',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                marginBottom: SPACING.S,
                padding: `0 ${SPACING['2XS']}` }}
              >
                esc
              </span>
              {' '}
              to
              close
            </p>
          </>
        </div>
      )
    : null;
};

CalendarView.propTypes = {
  isVisible: PropTypes.bool,
  weekOffset: PropTypes.number
};

const HoursPanelNextPrev = ({ toggleCalendarVisibility, isCalendarVisible }) => {
  const [{ weekOffset }, dispatch] = useStateValue();
  const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const fromDate = new Date(date);
  fromDate.setDate(date.getDate() + weekOffset * 7 - date.getDay());

  const toDate = new Date(date);
  toDate.setDate(date.getDate() + weekOffset * 7 + (6 - date.getDay()));

  const hoursRange = {
    label: `Showing hours from ${dateFormat(fromDate)} to ${dateFormat(toDate)}`,
    text: `${dateFormat(fromDate, true)} - ${dateFormat(toDate, true)}`
  };

  const handleInteraction = (event, action) => {
    if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
      event.preventDefault();
      action();
    }
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
          onClick={(event) => {
            return updateWeekOffset({ dispatch, event, relativeOffset: -1, weekOffset });
          }}
          onKeyDown={(event) => {
            return updateWeekOffset({ dispatch, event, relativeOffset: -1, weekOffset });
          }}
          type='previous'
          tabIndex={0}
        >
          Previous week
        </PreviousNextWeekButton>
        <Heading
          aria-live='polite'
          aria-atomic='true'
          level={2}
          size='S'
          onClick={(event) => {
            return handleInteraction(event, toggleCalendarVisibility);
          }}
          onKeyDown={(event) => {
            return handleInteraction(event, toggleCalendarVisibility);
          }}
          css={{
            color: 'var(--color-teal-400)',
            cursor: 'pointer',
            fontWeight: '700',
            textDecoration: 'underline'
          }}
          tabIndex={0}
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
          onClick={(event) => {
            return updateWeekOffset({ dispatch, event, relativeOffset: 1, weekOffset });
          }}
          onKeyDown={(event) => {
            return updateWeekOffset({ dispatch, event, relativeOffset: 1, weekOffset });
          }}
          type='next'
          tabIndex={0}
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
