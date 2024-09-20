import React, { useEffect, useState } from 'react';
import { displayHours } from '../utils/hours';
import PropTypes from 'prop-types';

export default function Hours ({ node }) {
  const [initialized, setInitialized] = useState(false);

  /*
   *We don't want to SSR hours since that
   *is dynamic to now.
   */
  useEffect(() => {
    setInitialized(true);
  }, [initialized]);

  if (!initialized) {
    return <>…</>;
  }

  const now = new Date();
  const hours = displayHours({ node, now });

  if (!hours) {
    return 'Today: n/a';
  }
  return <span>Today: {hours.text}</span>;
}

Hours.propTypes = {
  node: PropTypes.object
};
