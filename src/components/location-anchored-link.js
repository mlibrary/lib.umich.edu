import React from 'react';
import { LINK_STYLES } from '../reusable';

export default function LocationAnchoredLinks({ node }) {
  const parentTitle = node.relationships?.field_parent_location?.title;

  const title = parentTitle ? parentTitle : node.title;
  const titleSlugged = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  return (
    <a
      href={`/locations-and-hours/hours-view#${titleSlugged}`}
      css={{ ...LINK_STYLES['default'] }}
    >
      View more hours
    </a>
  );
}
