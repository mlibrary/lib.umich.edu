import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

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
    return null;
  }
);

const Text = ({ inline = false, lede, ...other }) => {
  return (
    <StyledText inline={inline} lede={lede} {...other} />
  );
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  inline: PropTypes.bool,
  lede: PropTypes.bool
};

export default Text;
