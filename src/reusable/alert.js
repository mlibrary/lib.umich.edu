import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../reusable';

/**
 *Use Alerts to notify users of important information.
 */
class Alert extends React.Component {
  render () {
    const { intent, children, className, ...other } = this.props;
    const alertStyles = (intent) => {
      if (intent === 'success') {
        return {
          background: COLORS.teal[100],
          borderColor: COLORS.teal[400]
        };
      }
      if (intent === 'warning') {
        return {
          background: COLORS.maize[100],
          borderColor: COLORS.maize[400]
        };
      }
      if (intent === 'error') {
        return {
          background: COLORS.orange[100],
          borderColor: COLORS.orange[500]
        };
      }
      return {
        background: COLORS.blue[100],
        borderColor: COLORS.blue[400]
      };
    };
    return (
      <div
        role={intent === 'error' ? 'alert' : intent === 'warning' ? 'status' : ''}
        intent={intent}
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
  }
}

Alert.propTypes = {
  intent: PropTypes.oneOf(['informational', 'error', 'warning', 'success']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Alert.defaultProps = {
  intent: 'informational'
};

export default Alert;
