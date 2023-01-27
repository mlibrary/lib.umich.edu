import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import { SPACING } from '../reusable';

const baseListStyles = {
  margin: '0',
  padding: '0',
  listStyle: 'none',
  maxWidth: '38rem',
  'li:not(:last-child)': {
    marginBottom: SPACING['XS'],
  },
};

const StyledList = styled('ul')({
  ...baseListStyles,
});

const listPaddingStyles = {
  marginLeft: '1.5rem',
};

const StyledUL = styled('ul')({
  ...baseListStyles,
  ...listPaddingStyles,
  listStyle: 'disc',
});

const StyledOL = styled('ol')({
  ...baseListStyles,
  ...listPaddingStyles,
  listStyle: 'decimal',
});

const List = ({ className, children, type, ...other }) => {
  if (type === 'bulleted') {
    return (
      <StyledUL className={className} {...other}>
        {children}
      </StyledUL>
    );
  }

  if (type === 'numbered') {
    return (
      <StyledOL className={className} {...other}>
        {children}
      </StyledOL>
    );
  }

  return (
    <StyledList className={className} {...other}>
      {children}
    </StyledList>
  );
};

List.propTypes = {
  type: PropTypes.string,
};

export default List;
