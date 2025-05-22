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
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${SPACING.S} 0 ${SPACING.S} ${SPACING.M}`,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          ':hover': {
            '[data-title]': {
              textDecoration: 'underline'
            },
            background: 'var(--color-teal-100)',
            borderLeft: `solid 4px var(--color-teal-400)`,
            outline: 'none',
            '> span:first-of-type': {
              marginLeft: '-4px'
            }
          }

        }}
      >
        <span css={{ fontSize: '1.1rem', fontWeight: '500' }}>{title}</span>
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
          padding: `0 ${SPACING.L}`
        }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Collapsible.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultExpanded: PropTypes.bool
};

export default Collapsible;
