import React, { useContext, useEffect } from 'react';
import { ExpandableContext } from './expandable';
import PropTypes from 'prop-types';

const ExpandableChildrenComponent = ({ children, show }) => {
  const context = useContext(ExpandableContext);

  useEffect(() => {
    if (children.length <= show && !context.disabled) {
      context.disable();
    }
  }, [children, show, context]);

  return (
    <>
      {context.expanded ? children : children.slice(0, show)}
    </>
  );
};

ExpandableChildrenComponent.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.number
};

ExpandableChildrenComponent.defaultProps = {
  show: 3
};

const ExpandableChildren = (props) => {
  return <ExpandableChildrenComponent {...props} />;
};

export default ExpandableChildren;
