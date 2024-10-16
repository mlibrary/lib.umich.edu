import React from 'react';
import { Script } from 'gatsby';
import SkipLinks from './src/components/skip-links';

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <Script src='https://umich.edu/apis/umalerts/umalerts.js' />
      <Script src='https://cdn.jsdelivr.net/npm/@umich-lib/web@latest/dist/umich-lib/umich-lib.esm.js' />
      <div
        css={{
          minHeight: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          gridTemplateColumns: '100%'
        }}
      >
        <div>
          <SkipLinks />
          <m-universal-header></m-universal-header>
        </div>
        {element}
      </div>
      <m-chat id='chat'></m-chat>
    </>
  );
};
