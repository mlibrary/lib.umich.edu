import { COLORS } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Use Alerts to notify users of important information.
 */
const Alert = ({ intent = 'informational', children, ...other }) => {
  const alertStyles = (alertIntent) => {
    switch (alertIntent) {
      case 'success':
        return {
          background: 'var(--color-teal-100)',
          borderColor: 'var(--color-teal-400)'
        };
      case 'warning':
        return {
          background: 'var(--color-maize-100)',
          borderColor: 'var(--color-maize-400)'
        };
      case 'error':
        return {
          background: 'var(--color-orange-100)',
          borderColor: 'var(--color-orange-500)'
        };
      default:
        return {
          background: 'var(--color-blue-100)',
          borderColor: 'var(--color-blue-400)'
        };
    }
  };

  const getRole = (roleIntent) => {
    if (roleIntent === 'error') {
      return 'alert';
    }
    if (roleIntent === 'warning') {
      return 'status';
    }
    return '';
  };

  return (
    <div
      role={getRole(intent)}
      css={{
        borderBottom: `solid 1px transparent`,
        margin: '0',
        padding: '0.5rem 0',
        ...alertStyles(intent)
      }}
      {...other}
    >
      <div
        css={{
          margin: '0 auto',
          padding: '0 1rem'
        }}
        data-inner-container
      >
        {children}
      </div>
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  intent: PropTypes.oneOf(['informational', 'error', 'warning', 'success'])
};

export default Alert;
