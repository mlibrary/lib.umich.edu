import { COLORS } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Use Alerts to notify users of important information.
 */
const Alert = ({ intent, children, ...other }) => {
  const alertStyles = (alertIntent) => {
    switch (alertIntent) {
      case 'success':
        return {
          background: COLORS.teal[100],
          borderColor: COLORS.teal[400]
        };
      case 'warning':
        return {
          background: COLORS.maize[100],
          borderColor: COLORS.maize[400]
        };
      case 'error':
        return {
          background: COLORS.orange[100],
          borderColor: COLORS.orange[500]
        };
      default:
        return {
          background: COLORS.blue[100],
          borderColor: COLORS.blue[400]
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

Alert.defaultProps = {
  intent: 'informational'
};

export default Alert;
