import { Icon, SPACING } from '../reusable';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Collapsible = ({ title, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div>
      <button
        onClick={() => {
          return setIsExpanded(!isExpanded);
        }}
        css={{
          ':hover': {
            '[data-title]': {
              textDecoration: 'underline'
            },
            background: 'var(--color-teal-100)',
            outline: 'none'
          },
          alignItems: 'center',
          background: 'none',
          borderLeft: `solid 4px var(--color-teal-400)`,
          color: 'var(--color-teal-400)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          marginLeft: '-4px',
          padding: `${SPACING.S} 0 ${SPACING.S} ${SPACING.M}`,
          width: '100%'

        }}
      >
        <span css={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{title}</span>
        <span css={{
          transform: isExpanded ? 'rotate(0)' : 'rotate(180deg)',
          transition: 'transform 0.2s ease-in-out'
        }}
        >
          <Icon icon='expand_more'></Icon>
        </span>
      </button>
      {isExpanded && (
        <div css={{
          padding: `${SPACING.M} 0`
        }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Collapsible.propTypes = {
  children: PropTypes.node.isRequired,
  defaultExpanded: PropTypes.bool,
  title: PropTypes.string.isRequired
};

export default Collapsible;
