import { Breadcrumb, BreadcrumbItem } from '../reusable';
import Link from './link';
import PropTypes from 'prop-types';
import React from 'react';

export default function BreadcrumbContainer ({ data, ...rest }) {
  /*
   *Breadcrumb data is provided as encoded JSON.
   *We need to decode it and check if it's valid.
   */
  const parsedData = JSON.parse(data);

  if (!parsedData) {
    return null;
  }

  return (
    <Breadcrumb {...rest}>
      {parsedData.map(({ text, to }, i) => {
        return (
          <BreadcrumbItem key={to + i}>
            {to
              ? (
                <Link to={to}>{text}</Link>
                )
              : (
                <React.Fragment>{text}</React.Fragment>
                )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

BreadcrumbContainer.propTypes = {
  data: PropTypes.string
};
