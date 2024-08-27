import { lightOrDark, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

const getButtonColor = (kind) => {
  switch (kind) {
    case 'primary':
      return 'var(--color-maize-';
    case 'secondary':
    case 'tertiary':
      return 'var(--color-teal-';
    default:
      return 'var(--color-blue-';
  }
};

const getButtonKindCSS = (kind, color) => {
  switch (kind) {
    case 'tertiary':
      return {
        ':hover': {
          outline: `solid 1px ${color}400)'}`,
          outlineOffset: '-2px'
        },
        background: 'white',
        border: `solid 1px ${color}400)'}`,
        color: `${color}400)`,
        padding: `calc(${SPACING.XS} - 1px) calc(${SPACING.M} - 1px)`
      };
    case 'subtle':
      return {
        ':hover': {
          background: 'var(--color-blue-200)'
        },
        background: 'var(--color-neutral-100)'
      };
    case 'reset':
      return {};
    default:
      return {
        ':hover': {
          background: `${color}500)`
        },
        background: `${color}400)`
      };
  }
};

const getDisabledCSS = (disabled) => {
  if (disabled) {
    return {
      ':hover': {},
      cursor: 'not-allowed',
      opacity: '0.5'
    };
  }

  return {};
};

const getButtonCSS = (kind, disabled) => {
  const color = getButtonColor(kind);

  if (kind === 'reset') {
    return {};
  }

  return {
    alignItems: 'center',
    borderRadius: '2px',
    color:
      lightOrDark(`${color}400)`) === 'light' || kind === 'subtle'
        ? 'inherit'
        : 'white',
    display: 'flex',
    fontWeight: '800',
    minHeight: '2.5rem',
    padding: `${SPACING.XS} ${SPACING.M}`,
    ...getButtonKindCSS(kind, color, disabled),
    ':focus': {
      boxShadow: `0 0 0 3px #ffffff, 0 0 0 4px var(--color-neutral-400)`,
      outline: 'none'
    },
    ...getDisabledCSS(disabled)
  };
};

/**
 * Use buttons to move though a transaction, aim to use only one primary button per page.
 */
const Button = ({ kind = 'secondary', disabled, ...rest }) => {
  return <button css={getButtonCSS(kind, disabled)} {...rest} />;
};

Button.propTypes = {
  disabled: PropTypes.bool,
  kind: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'subtle', 'reset'])
    .isRequired
};

export default Button;
