import React from 'react';
import { createSlug } from '../reusable';
import Link from './link';

export default function LocationAnchoredLinks({ node }) {
  const parentTitle = node.relationships?.field_parent_location?.title;

  const title = parentTitle ? parentTitle : node.title;

  return (
    <Link to={`/locations-and-hours/hours-view#${createSlug(title)}`}>
      View more hours
    </Link>
  );
}
