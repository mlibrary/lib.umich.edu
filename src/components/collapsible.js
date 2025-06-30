import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Icon, SPACING } from '../reusable';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const useIsMobile = (breakpoint = 1200) => {
  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  return isMobile;
};

const Collapsible = ({ title, children, defaultExpanded }) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(
    typeof defaultExpanded === 'undefined' ? isMobile === false : defaultExpanded
  );
  const shouldReduceMotion = useReducedMotion();
  const id = title.replace(/[\s,]+/gu, '-').replace(/[^a-zA-Z0-9-_]/gu, '').toLowerCase();
  useEffect(() => {
    if (!defaultExpanded) {
      setIsExpanded(!isMobile);
    }
  }, [isMobile, defaultExpanded]);
  return (
    <div>
      <button
        onClick={() => {
          return setIsExpanded(!isExpanded);
        }}
        aria-expanded={isExpanded}
        aria-controls={`expandable-${id}`}
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
          borderLeft: `${isExpanded ? 'solid 4px var(--color-teal-400)' : 'none'}`,
          color: `${isExpanded ? 'var(--color-teal-400)' : 'var(--color-neutral-400)'}`,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          padding: `${SPACING.S}`,
          width: '100%'

        }}
      >
        <span
          css={{
            fontSize: '1.1rem',
            fontWeight: `${isExpanded ? 'bold' : 'normal'}`,
            marginLeft: `${isExpanded ? '-4px' : '0'}`
          }}
        >
          {title}
        </span>
        <span css={{
          transform: isExpanded ? 'rotate(0)' : 'rotate(180deg)',
          transformOrigin: 'center 13px',
          transition: 'transform 0.2s ease-in-out'
        }}
        >
          <Icon size={20} css={{ color: 'var(--color-teal-400)' }} icon='expand_more'></Icon>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key='content'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0, ease: 'easeInOut' } : { duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
            aria-hidden={!isExpanded}
            id={`expandable-${id}`}
          >
            <div
              css={{
                display: isExpanded ? 'block' : 'none',
                padding: `${SPACING.M} 0`
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Collapsible.propTypes = {
  children: PropTypes.node.isRequired,
  defaultExpanded: PropTypes.bool,
  title: PropTypes.string.isRequired
};

export default Collapsible;
