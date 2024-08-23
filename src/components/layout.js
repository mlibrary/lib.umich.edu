import { COLORS, GlobalStyleSheet } from '../reusable';
import Footer from './footer';
import { Global } from '@emotion/react';
import Header from './header';
import PropTypes from 'prop-types';
import React from 'react';
import useNavigationData from '../hooks/use-navigation-data';

const Layout = ({ children, drupalNid }) => {
  const { primary, secondary } = useNavigationData();

  return (
    <React.Fragment>
      <GlobalStyleSheet />
      <Global
        styles={{
          '*:focus': {
            outlineColor: COLORS.blue['400']
          },
          '[data-reach-dialog-overlay]': {
            background: 'hsla(0, 0%, 0%, 0.6)',
            zIndex: '999'
          },
          'h1.focus': {
            '&:focus': {
              '&:before': {
                borderLeft: `solid 4px var(--colors-teal-400)`,
                content: '""',
                height: '100%',
                left: '-0.3em',
                position: 'absolute'
              },
              outline: '0'
            },
            position: 'relative'
          },
          'html, body, #___gatsby, #___gatsby > div': {
            height: '100%'
          }
        }}
      />
      <Header primary={primary} secondary={secondary} />
      <main id='maincontent'>{children}</main>
      <Footer />
      {drupalNid && (
        <div
          css={{ display: 'none' }}
          id='drupalNid'
          data-drupal-nid={drupalNid}
        />
      )}
    </React.Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  drupalNid: PropTypes.number
};

export default Layout;
