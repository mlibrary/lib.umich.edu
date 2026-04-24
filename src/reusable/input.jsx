import { INTENT_COLORS } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const StyledInput = styled('input')(
  {
    appearance: 'textfield',
    border: 'solid 1px rgba(0,0,0,0.5)',
    borderRadius: '4px',
    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: '1rem',
    margin: '0',
    padding: '0.5rem 0.75rem',
    width: '100%'
  },
  ({ invalid }) => {
    return {
      borderColor: invalid && INTENT_COLORS.error,
      borderWidth: invalid && '2px'
    };
  }
);

const Input = ({ className, ...other }) => {
  return <StyledInput className={className} {...other} />;
};

Input.propTypes = {
  className: PropTypes.string
};

export default Input;
