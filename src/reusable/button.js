import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, lightOrDark, SPACING } from '../reusable';

function getButtonColor (kind) {
  switch (kind) {
    case 'primary':
      return COLORS.maize;
    case 'secondary':
    case 'tertiary':
      return COLORS.teal;
    default:
      return COLORS.blue;
  }
}

function getButtonKindCSS (kind, color) {
  switch (kind) {
    case 'tertiary':
      return {
        background: 'white',
        padding: `calc(${SPACING.XS} - 1px) calc(${SPACING.M} - 1px)`,
        border: `solid 1px ${color['400']}`,
        color: color['400'],
        ':hover': {
          outline: `solid 1px ${color['400']}`,
          outlineOffset: '-2px'
        }
      };
    case 'subtle':
      return {
        background: COLORS.neutral['100'],
        ':hover': {
          background: COLORS.blue['200']
        }
      };
    case 'reset':
      return {};
    default:
      return {
        background: color['400'],
        ':hover': {
          background: color['500']
        }
      };
  }
}

function getDisabledCSS (disabled) {
  if (disabled) {
    return {
      opacity: '0.5',
      ':hover': {},
      cursor: 'not-allowed'
    };
  }

  return {};
}

function getButtonCSS (kind, disabled) {
  const color = getButtonColor(kind);

  if (kind === 'reset') {
    return {};
  }

  return {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '2px',
    minHeight: '2.5rem',
    padding: `${SPACING.XS} ${SPACING.M}`,
    color:
      lightOrDark(color['400']) === 'light' || kind === 'subtle'
        ? 'inherit'
        : 'white',
    fontWeight: '800',
    ...getButtonKindCSS(kind, color, disabled),
    ':focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px #ffffff, 0 0 0 4px ${COLORS.neutral['400']}`
    },
    ...getDisabledCSS(disabled)
  };
}

/**
 * Use buttons to move though a transaction, aim to use only one primary button per page.
 */
const Button = ({ kind, disabled, ...rest }) => {
  return <button css={getButtonCSS(kind, disabled)} {...rest} />;
};

Button.propTypes = {
  kind: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'subtle', 'reset'])
    .isRequired
};

Button.defaultProps = {
  kind: 'secondary'
};

export default Button;
