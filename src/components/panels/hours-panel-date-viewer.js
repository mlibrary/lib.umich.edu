import { Heading, Icon, Kbd, Margins, MEDIA_QUERIES, SPACING, TYPOGRAPHY } from '../../reusable';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useStateValue } from '../use-state';

const dateFormat = (date, abbreviated = false) => {
  const options = {
    day: 'numeric',
    month: abbreviated ? 'short' : 'long',
    ...(abbreviated ? {} : { weekday: 'long', year: 'numeric' })
  };

  return date.toLocaleString('en-US', options);
};

const isEnterOrSpace = (event) => {
  return event.key === 'Enter' || event.key === ' ';
};

const updateWeekOffset = ({
  dispatch,
  weekOffset,
  event = null,
  week = null,
  relativeOffset = null
}) => {
  if (!event || event.type === 'click' || (event.type === 'keydown' && isEnterOrSpace)) {
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
    setCalendarStatus(`Calendar ${isCalendarVisible ? 'closed' : 'open'}`);
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
      id='dateViewerBar'
    >
      <div
        aria-live='polite'
        aria-atomic='true'
        className='visually-hidden'
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

  const handleMonthChange = (direction) => {
    const setMonth = new Date(currentBrowseDate.setMonth(currentBrowseDate.getMonth() + direction));
    setCurrentDate(new Date(setMonth.setDate(1)));
  };

  const startOfDay = (date) => {
    return new Date(date.setHours(0, 0, 0, 0));
  };

  const startOfWeek = (date) => {
    const newDate = startOfDay(new Date(date));
    newDate.setDate(newDate.getDate() - newDate.getDay());
    return newDate;
  };

  const getColorBasedOnDate = (date) => {
    const today = startOfDay(new Date());
    const targetDay = startOfDay(date);

    if (targetDay.getTime() === today.getTime()) {
      return 'var(--color-maize-400)';
    }
    if (startOfWeek(targetDay).getTime() === startOfWeek(today).getTime()) {
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
  const [month] = monthYear.split(' ');

  const getFormattedDate = (date) => {
    /* eslint-disable sort-keys */
    return date.toLocaleString('default', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    /* eslint-enable sort-keys */
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
            top: '45px',
            transition: 'height 0.3s ease',
            width: '100%',
            zIndex: 1
          }}
          role='region'
          aria-label='calendar navigation '
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
              onClick={() => {
                return handleMonthChange(-1);
              }}
              css={{
                ...TYPOGRAPHY.M,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label='previous month'
            >
              <Icon
                width='24px'
                height='24px'
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
              onClick={() => {
                return handleMonthChange(1);
              }}
              css={{
                ...TYPOGRAPHY.M,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label='Next month'
            >
              <Icon
                width='24px'
                height='24px'
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
                  <div key={day}>
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
                const currentlySelectedWeek = week.some((day) => {
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
                    aria-label={`${currentlySelectedWeek ? 'This is the currently selected week.' : 'View'} week ${weekIndex + 1} in ${month} from ${getFormattedDate(week[0])} to ${getFormattedDate(week[week.length - 1])}`}
                    css={{
                      border: `2px solid ${currentlySelectedWeek ? 'var(--color-maize-400)' : 'transparent'}`,
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
              <Kbd>
                esc
              </Kbd>
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
    if (event.type === 'click' || (event.type === 'keydown' && isEnterOrSpace)) {
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
          alignItems: 'center',
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

        >
          Previous week
        </PreviousNextWeekButton>
        <button
          css={{
            boxShadow: 'none',
            color: 'inherit',
            ...(isCalendarVisible
              ? {
                  boxShadow: 'inset 0 -2px var(--color-teal-400)'
                }
              : {
                  '&:hover': {
                    boxShadow: 'inset 0 -2px var(--color-teal-400)'
                  }
                })
          }}
          onClick={(event) => {
            return handleInteraction(event, toggleCalendarVisibility);
          }}
          onKeyDown={(event) => {
            return handleInteraction(event, toggleCalendarVisibility);
          }}
        >
          <Heading
            level={2}
            size='S'
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
        </button>

        <CalendarView isVisible={isCalendarVisible} weekOffset={weekOffset} />

        <PreviousNextWeekButton
          onClick={(event) => {
            return updateWeekOffset({ dispatch, event, relativeOffset: 1, weekOffset });
          }}
          onKeyDown={(event) => {
            return updateWeekOffset({ dispatch, event, relativeOffset: 1, weekOffset });
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
      <button
        {...rest}
        css={{
          '&:hover': {
            boxShadow: 'inset 0 -2px var(--color-teal-400);'
          },
          boxShadow: 'none',
          color: 'var(--color-teal-400)',
          display: 'none',
          fontWeight: 'bold',
          gap: SPACING['2XS'],
          margin: '.5rem 0',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'flex'
          }
        }}
      >
        {type === 'previous' && (
          <Icon
            width='24px'
            height='24px'
            icon='navigate_before'
          />
        )}
        {children}
        {type === 'next' && (
          <Icon
            width='24px'
            height='24px'
            icon='navigate_next'
          />
        )}
      </button>
      <button
        {...rest}
        css={{
          boxShadow: 'none',
          color: 'var(--color-teal-400)',
          display: 'flex',
          fontWeight: 'bold',
          gap: SPACING['2XS'],
          margin: '.5rem 0',
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: 'none'
          }
        }}
      >
        <Icon
          width='24px'
          height='24px'
          icon={type === 'previous' ? 'navigate_before' : 'navigate_next'}
        />
        <span className='visually-hidden'>{children}</span>
      </button>
    </>
  );
};

PreviousNextWeekButton.propTypes = {
  children: PropTypes.string,
  type: PropTypes.string
};
