import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../reusable';

const Checkbox = ({
  id,
  checked,
  indeterminate = false,
  onChange,
  label,
  isParent = false,
  style = {},
  ...props
}) => {
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div style={{
      alignItems: 'center',
      display: 'flex',
      marginBottom: SPACING.S,
      ...style
    }}
    >
      <input
        id={id}
        ref={inputRef}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        css={{
          accentColor: 'var(--color-teal-400)',
          flexShrink: 0,
          height: '18px',
          marginLeft: 0,
          marginRight: '0.75rem',
          width: '18px'
        }}
        {...props}
      />
      <label
        htmlFor={id}
        css={{
          color: 'var(--color-neutral-400)',
          fontSize: '1rem',
          fontWeight: isParent ? 'bold' : 'normal'
        }}
      >
        {label}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.any,
  id: PropTypes.any,
  indeterminate: PropTypes.bool,
  isParent: PropTypes.bool,
  label: PropTypes.any,
  onChange: PropTypes.any,
  style: PropTypes.object
};

export default Checkbox;
