import { LINK_STYLES } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const StyledLink = styled('a')((props) => {
  return LINK_STYLES[props.kind];
});

export default function Link ({ children, kind = 'default', as = 'a', ...other }) {
  return <StyledLink as={as} kind={kind} {...other}>{children}</StyledLink>;
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  kind: PropTypes.oneOf([
    'default',
    'subtle',
    'light',
    'special',
    'list',
    'list-medium',
    'list-strong',
    'description'
  ])
};
