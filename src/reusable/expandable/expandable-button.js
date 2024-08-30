import React, { useContext } from 'react';
import { Button } from '../../reusable';
import { ExpandableContext } from './expandable';
import PropTypes from 'prop-types';

const cleanList = (list) => {
  return list
    .filter((toFilter) => {
      return Boolean(toFilter);
    })
    .join(' ')
    .trim();
};

const ExpandableButton = (props) => {
  const context = useContext(ExpandableContext);

  if (context.disabled) {
    return null;
  }

  return (
    <>
      <Button
        {...props}
        onClick={context.toggleExpanded}
      >
        {context.expanded
          ? cleanList(['Show fewer', props.name])
          : cleanList(['Show all', props.count, props.name])}
      </Button>
    </>
  );
};

ExpandableButton.propTypes = {
  count: PropTypes.number,
  name: PropTypes.string,
  props: PropTypes.object
};

export default ExpandableButton;
