import { Heading } from '../reusable';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const getPages = (data) => {
  return data.map((page) => {
    const pages = page.relationships && page.relationships.node__page;

    return {
      pages: pages ? getPages(pages) : null,
      text: page.title,
      to: page.path.alias
    };
  });
};

const StyledNav = styled('nav')({
  marginTop: '1rem'
});

const StyledNavList = styled('nav')({
  listStyle: 'none',
  margin: '0',
  padding: '0'
});

const StyledLink = styled(Link)({
  ':hover': {
    textDecoration: 'underline'
  },
  display: 'block',
  padding: '0.15rem 0'
});

const Navigation = ({ data }) => {
  if (!data) {
    return null;
  }
  const navData = getPages(data);

  return (
    <StyledNav>
      <Heading
        level={2}
        size='medium'
        style={{
          marginTop: 0
        }}
      >
        In this section
      </Heading>
      <StyledNavList>
        {navData.map((item, index) => {
          return (
            <li key={`styled-link-${index}`}>
              <StyledLink to={item.to}>{item.text}</StyledLink>
            </li>
          );
        })}
      </StyledNavList>
    </StyledNav>
  );
};

Navigation.propTypes = {
  data: PropTypes.node
};

export default Navigation;
