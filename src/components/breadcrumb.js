import React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@reusable';
import Link from './link';

export default function BreadcrumbContainer({ data, ...rest }) {
  /*
    Breadcrumb data is provided as encoded JSON.
    We need to decode it and check if it's valid.
  */
  const parsed_data = JSON.parse(data);

  if (!parsed_data) {
    return null;
  }

  return (
    <Breadcrumb {...rest}>
      {parsed_data.map(({ text, to }, i) => (
        <BreadcrumbItem key={to + i}>
          {to ? (
            <Link to={to}>{text}</Link>
          ) : (
            <React.Fragment>{text}</React.Fragment>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
