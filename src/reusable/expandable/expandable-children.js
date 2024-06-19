import React, { useContext, useEffect } from 'react';
import { ExpandableContext } from './expandable';
import PropTypes from 'prop-types';

const ExpandableChildren = () => {
  const context = useContext(ExpandableContext);
  const { children, show } = useContext(ExpandableContext);

  useEffect(() => {
    if (children.length <= show && !context.disabled) {
      context.disable();
    }
  }, [children, show, context]);

  return (
    <React.Fragment>
      {context.expanded ? children : children.slice(0, show)}
    </React.Fragment>
  );
};

ExpandableChildren.propTypes = {
  show: PropTypes.number
};

ExpandableChildren.defaultProps = {
  show: 3
};

export default ExpandableChildren;
