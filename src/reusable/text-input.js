import { COLORS, Icon, Input } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const StyledFormItem = styled('div')(
  {
    boxSizing: 'border-box',
    width: '100%'
  },
  ({ invalid }) => {
    return {
      borderLeft: invalid && `solid 4px ${COLORS.orange[400]}`,
      paddingLeft: invalid && '1rem'
    };
  }
);

const StyledLabel = styled('label')({
  boxSizing: 'border-box',
  display: 'block',
  marginBottom: '0.5rem'
});

const StyledFormItemDescription = styled('span')({
  color: COLORS.neutral[400],
  display: 'block'
});

const StyledFormItemErrorMessage = styled('p')({
  color: COLORS.orange[400],
  fontWeight: '600',
  marginTop: '0.5rem'
});

/**
 *Use this when you need to let users enter text that's no longer than a single line.
 */
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const TextInput = ({
  descriptionText,
  disabled = false,
  hideLabel,
  id,
  invalid = false,
  invalidText = '',
  labelText,
  onChange = () => {},
  onClick = () => {},
  placeholder,
  type = 'text',
  ...other
}) => {
/* eslint-enable no-empty-function */
/* eslint-enable no-unused-vars */
  const textInputProps = {
    id,
    onChange: (evt) => {
      if (!other.disabled) {
        onChange(evt);
      }
    },
    onClick: (evt) => {
      if (!other.disabled) {
        onClick(evt);
      }
    },
    placeholder,
    type
  };

  const errorId = `${id}-error-msg`;

  const description = descriptionText
    ? (
        <StyledFormItemDescription>{descriptionText}</StyledFormItemDescription>
      )
    : null;

  const label = labelText
    ? (
        <StyledLabel htmlFor={id}>
          <span>{labelText}</span>
          {description}
        </StyledLabel>
      )
    : null;

  const error = invalid
    ? (
        <StyledFormItemErrorMessage id={errorId}>
          <Icon icon='error' /> {invalidText}
        </StyledFormItemErrorMessage>
      )
    : null;

  const input = invalid
    ? (
        <Input
          {...other}
          {...textInputProps}
          invalid
          data-invalid
          aria-invalid
          aria-describedby={errorId}
        />
      )
    : (
        <Input {...other} {...textInputProps} />
      );

  return (
    <StyledFormItem invalid={invalid}>
      {hideLabel
        ? (
            <span className='visually-hidden'>{label}</span>
          )
        : (
            <React.Fragment>{label}</React.Fragment>
          )}
      {input}
      {error}
    </StyledFormItem>
  );
};

TextInput.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  descriptionText: PropTypes.string,
  disabled: PropTypes.bool,
  hideLabel: PropTypes.bool,
  id: PropTypes.string.isRequired,
  invalid: PropTypes.bool,
  invalidText: PropTypes.string,
  labelText: PropTypes.node.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default TextInput;
