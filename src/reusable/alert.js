import React from 'react';
import PropTypes from 'prop-types';
import ReachAlert from '@reach/alert';
import { COLORS } from '../reusable';
import styled from '@emotion/styled';

const alertIntentStyles = {
  informational: {
    background: COLORS.blue[100],
    borderColor: COLORS.blue[400],
  },
  success: {
    background: COLORS.teal[100],
    borderColor: COLORS.teal[400],
  },
  warning: {
    background: COLORS.maize[100],
    borderColor: COLORS.maize[400],
  },
  error: {
    background: COLORS.orange[100],
    borderColor: COLORS.orange[500],
  },
};

const StyledAlert = styled(ReachAlert)(
  {
    margin: '0',
    padding: '0.5rem 0',
    borderBottom: `solid 1px transparent`,
  },
  (props) => ({
    ...alertIntentStyles[props.intent],
  })
);

const StyledAlertInner = styled('div')({
  margin: '0 auto',
  padding: '0 1rem',
});

/**
  Use Alerts to notify users of important information. 
*/
class Alert extends React.Component {
  render() {
    const { intent, children, className, ...other } = this.props;

    return (
      <StyledAlert intent={intent} {...other}>
        <StyledAlertInner data-inner-container>{children}</StyledAlertInner>
      </StyledAlert>
    );
  }
}

Alert.propTypes = {
  intent: PropTypes.oneOf(['informational', 'error', 'warning', 'success']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Alert.defaultProps = {
  intent: 'informational',
};

export default Alert;
