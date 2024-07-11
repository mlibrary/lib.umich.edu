import EventsAndExhibitsPanel from './events-and-exhibits-panel';
import FeaturedAndLatestNewsPanel from './featured-and-latest-news';
import PropTypes from 'prop-types';
import React from 'react';
import WhatsHappening from './whats-happening-panel';

export default function CustomPanel ({ data }) {
  const name = data.field_machine_name;

  if (name === 'featured_and_latest_news') {
    return <FeaturedAndLatestNewsPanel data={data} />;
  } else if (name === 'ee_featured') {
    return <WhatsHappening />;
  } else if (name === 'ee_landing') {
    return <EventsAndExhibitsPanel />;
  }

  return null;
}

CustomPanel.propTypes = {
  data: PropTypes.object
};
