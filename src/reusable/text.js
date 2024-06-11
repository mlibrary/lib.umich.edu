import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import { TYPOGRAPHY } from '../reusable';

const StyledText = styled('p')(
  {
    maxWidth: '38rem'
  },
  ({ inline }) => {
    return {
      display: inline && 'inline'
    };
  },
  ({ size }) => {
    return {
      ...TYPOGRAPHY[size]
    };
  },
  ({ lede }) => {
    if (lede) {
      return TYPOGRAPHY.XS;
    }
  }
);

const Text = ({ inline, lede, ...other }) => {
  return (
    <StyledText inline={inline} lede={lede} {...other} />
  );
};

Text.propTypes = {
  inline: PropTypes.bool,
  lede: PropTypes.bool,
  children: PropTypes.node.isRequired
};

Text.defaultProps = {
  inline: false
};

export default Text;
