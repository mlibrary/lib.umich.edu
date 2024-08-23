import { COLORS, Icon, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export default function Select ({ label, name, options, value, ...rest }) {
  return (
    <label>
      <span
        css={{
          display: 'block',
          marginBottom: SPACING.XS
        }}
      >
        {label}
      </span>
      <div
        css={{
          position: 'relative'
        }}
      >
        <select
          name={name}
          css={{
            // Reset default <select> styles.
            appearance: 'none',
            background: 'transparent',
            backgroundImage: 'none',
            border: `solid 1px var(--colors-neutral-300)`,
            borderRadius: '4px',
            boxShadow: 'none',
            display: 'block',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            height: '40px',
            lineHeight: '1.5',
            padding: `${SPACING.XS} ${SPACING.XS}`,
            paddingRight: `2rem`,
            width: '100%'
          }}
          value={value ? value : 'All'}
          {...rest}
        >
          {options.map((opt, item) => {
            return (
              <option key={opt + item} id={name + opt} value={opt}>
                {opt}
              </option>
            );
          })}
          c
        </select>
        <Icon
          icon='expand_more'
          css={{
            bottom: SPACING.S,
            pointerEvents: 'none',
            position: 'absolute',
            right: SPACING.S
          }}
        />
      </div>
    </label>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string
};
