import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ExpandableContext } from './expandable';

class ExpandableChildrenComponent extends Component {
  componentDidMount () {
    const { context, children, show } = this.props;

    if (children.length <= show && !context.disabled) {
      context.disable();
    }
  }

  render () {
    const { context, children, show } = this.props;

    return (
      <React.Fragment>
        {context.expanded ? children : children.slice(0, show)}
      </React.Fragment>
    );
  }
}

ExpandableChildrenComponent.propTypes = {
  show: PropTypes.number
};

ExpandableChildrenComponent.defaultProps = {
  show: 3
};

function ExpandableChildren (props) {
  return (
    <ExpandableContext.Consumer>
      {(context) => {
        return (
          <ExpandableChildrenComponent {...props} context={context} />
        );
      }}
    </ExpandableContext.Consumer>
  );
}

export default ExpandableChildren;
