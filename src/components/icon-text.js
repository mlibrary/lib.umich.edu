import { Icon } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export default function IconText ({ d: data, icon, children }) {
  return (
    <span css={{ display: 'flex' }}>
      <span
        css={{
          flexShrink: '0',
          marginTop: '-2px',
          width: '1.75rem'
        }}
      >
        {data ? <Icon d={data} /> : <Icon icon={icon} />}
      </span>
      {children}
    </span>
  );
}

IconText.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  icon: PropTypes.string
};
