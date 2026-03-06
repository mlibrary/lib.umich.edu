import { ExpandableContext } from './expandable';
import PropTypes from 'prop-types';
import React from 'react';

/*
 *Provides expandable 'context' as a render prop.
 */
const ExpandableProvider = (props) => {
  return (
    <ExpandableContext.Consumer>
      {(context) => {
        return <React.Fragment>{props.children(context)}</React.Fragment>;
      }}
    </ExpandableContext.Consumer>
  );
};

ExpandableProvider.propTypes = {
  children: PropTypes.node
};

export default ExpandableProvider;
