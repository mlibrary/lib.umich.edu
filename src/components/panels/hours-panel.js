import {
  createSlug,
  Heading,
  Margins,
  SPACING
} from '../../reusable';
import { displayHours } from '../../utils/hours';
import HoursTable from '../hours-table';
import Html from '../html';
import PropTypes from 'prop-types';
import React from 'react';
import { useStateValue } from '../use-state';

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
};

HoursPanelContainer.propTypes = {
  data: PropTypes.object
};
