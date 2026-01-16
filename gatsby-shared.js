import React from 'react';
import { Script } from 'gatsby';
import SkipLinks from './src/components/skip-links';
import { GatsbyLink } from 'gatsby';

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <Script src='https://umich.edu/apis/umalerts/umalerts.js' />
      <Script type='module' src='https://cdn.jsdelivr.net/npm/@umich-lib/design-system@latest/dist/umich-lib-components.min.js' />
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '100%',
          gridTemplateRows: 'auto auto 1fr',
          minHeight: '100%'
        }}
      >
        <div>
          <m-skip-links>
            <a href='/site-map'>View site map</a>
          </m-skip-links>
          <div
            css={{
              backgroundColor: 'var(--color-blue-100)',
              minHeight: '37px'
            }}
          >
            <m-universal-header></m-universal-header>
          </div>
        </div>
        {element}
      </div>
      <m-chat id='chat'></m-chat>
    </>
  ); ;
};
