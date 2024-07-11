import React from 'react';
import { ExpandableContext } from './expandable';

/*
 *Provides expandable 'context' as a render prop.
 */
function ExpandableProvider (props) {
  return (
    <ExpandableContext.Consumer>
      {(context) => {
        return <React.Fragment>{props.children(context)}</React.Fragment>;
      }}
    </ExpandableContext.Consumer>
  );
}

export default ExpandableProvider;
