import { createSlug } from '../reusable';
import Link from './link';
import PropTypes from 'prop-types';
import React from 'react';

export default function LocationAnchoredLink ({ node }) {
  const parentTitle = node.relationships?.field_parent_location?.title;

  const title = parentTitle ? parentTitle : node.title;
  return (
    <Link to={`/locations-and-hours/hours-view#${createSlug(title)}`}>
      View more hours
    </Link>
  );
}

LocationAnchoredLink.propTypes = {
  node: PropTypes.any
};
