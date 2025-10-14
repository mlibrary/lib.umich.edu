import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

import { TYPOGRAPHY } from '../reusable';

/*
 *Start with base styles and then bring in the
 *styles specific to the size of the heading.
 */
const StyledHeading = styled.h1(({ size }) => {
  return TYPOGRAPHY[size];
});

/**
 *Use headings consistently to create a clear content hierarchy.
 */
const Heading = ({ children, level = 1, size = 'small', className, ...other }) => {
  return (
    <StyledHeading as={`h${level}`} size={size} className={className} {...other}>
      {children}
    </StyledHeading>
  );
};

Heading.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   *Avoid skipping heading levels: always start the page from level 1, next use level 2 and so on. Avoid using level 1 more than once on a page.
   */
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  size: PropTypes.oneOf(Object.keys(TYPOGRAPHY))
};

export default Heading;
