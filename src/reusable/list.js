import PropTypes from 'prop-types';
import React from 'react';
import { SPACING } from '../reusable';
import styled from '@emotion/styled';

const baseListStyles = {
  'li:not(:last-child)': {
    marginBottom: SPACING.XS
  },
  listStyle: 'none',
  margin: '0',
  maxWidth: '38rem',
  padding: '0'
};

const StyledList = styled('ul')({
  ...baseListStyles
});

const listPaddingStyles = {
  marginLeft: '1.5rem'
};

const StyledUL = styled('ul')({
  ...baseListStyles,
  ...listPaddingStyles,
  listStyle: 'disc'
});

const StyledOL = styled('ol')({
  ...baseListStyles,
  ...listPaddingStyles,
  listStyle: 'decimal'
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
  children: PropTypes.any,
  className: PropTypes.any,
  type: PropTypes.string
};

export default List;
