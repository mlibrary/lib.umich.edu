import HeaderLargeScreen from './header-largescreen';
import HeaderSmallScreen from './header-smallscreen';
import PropTypes from 'prop-types';
import React from 'react';

const Header = ({ primary, secondary }) => {
  return (
    <React.Fragment>
      <HeaderSmallScreen primary={primary} secondary={secondary} />
      <HeaderLargeScreen primary={primary} secondary={secondary} />
    </React.Fragment>
  );
};

Header.propTypes = {
  primary: PropTypes.array,
  secondary: PropTypes.array
};

export default Header;
