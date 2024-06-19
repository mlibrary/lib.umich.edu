import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

const ExpandableContext = React.createContext();

/**
  Use Expandable to show only the first few items.
  The remaining will be hidden and can be expanded by the user.
*/
const Expandable = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const toggleExpanded = useCallback(() => {
    setExpanded((prevExpanded) => {
      return !prevExpanded;
    });
  }, []);

  const disable = useCallback(() => {
    setDisabled(true);
  }, []);

  return (
    <ExpandableContext.Provider value={{ disable, disabled, expanded, toggleExpanded }}>
      {children}
    </ExpandableContext.Provider>
  );
};

Expandable.propTypes = {
  children: PropTypes.node.isRequired
};

Expandable.defaultProps = {
  expanded: false
};

export default Expandable;
export { ExpandableContext };
