import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { COLORS, Input, Icon } from '@reusable'
import VisuallyHidden from '@reach/visually-hidden'

const StyledFormItem = styled('div')(
  {
    width: '100%',
    boxSizing: 'border-box',
  },
  ({ invalid }) => ({
    borderLeft: invalid && `solid 4px ${COLORS.orange[400]}`,
    paddingLeft: invalid && '1rem',
  })
)

const StyledLabel = styled('label')({
  display: 'block',
  marginBottom: '0.5rem',
  boxSizing: 'border-box',
})

const StyledFormItemDescription = styled('span')({
  display: 'block',
  color: COLORS.neutral[400],
})

const StyledFormItemErrorMessage = styled('p')({
  marginTop: '0.5rem',
  color: COLORS.orange[400],
  fontWeight: '600',
})

/**
  Use this when you need to let users enter text that's no longer than a single line.
*/
const TextInput = ({
  labelText,
  descriptionText,
  className,
  id,
  placeholder,
  type,
  onChange,
  onClick,
  hideLabel,
  invalid,
  invalidText,
  ...other
}) => {
  const textInputProps = {
    id,
    onChange: evt => {
      if (!other.disabled) {
        onChange(evt)
      }
    },
    onClick: evt => {
      if (!other.disabled) {
        onClick(evt)
      }
    },
    placeholder,
    type,
  }

  const errorId = id + '-error-msg'

  const description = descriptionText ? (
    <StyledFormItemDescription>{descriptionText}</StyledFormItemDescription>
  ) : null

  // TODO: add hidden style
  const label = labelText ? (
    <StyledLabel htmlFor={id}>
      <span>{labelText}</span>
      {description}
    </StyledLabel>
  ) : null

  const error = invalid ? (
    <StyledFormItemErrorMessage id={errorId}>
      <Icon icon="error" /> {invalidText}
    </StyledFormItemErrorMessage>
  ) : null

  const input = invalid ? (
    <Input
      {...other}
      {...textInputProps}
      invalid
      data-invalid
      aria-invalid
      aria-describedby={errorId}
    />
  ) : (
    <Input {...other} {...textInputProps} />
  )

  return (
    <StyledFormItem invalid={invalid}>
      {hideLabel ? (
        <VisuallyHidden>{label}</VisuallyHidden>
      ) : (
        <React.Fragment>{label}</React.Fragment>
      )}
      {input}
      {error}
    </StyledFormItem>
  )
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.node.isRequired,
  hideLabel: PropTypes.bool,
  className: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  invalid: PropTypes.bool,
  invalidText: PropTypes.string,
}

TextInput.defaultProps = {
  disabled: false,
  type: 'text',
  onChange: () => {},
  onClick: () => {},
  invalid: false,
  invalidText: '',
}

export default TextInput
