import React from 'react';
import { Script } from 'gatsby';
import SkipLinks from './src/components/skip-links';

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <Script src='https://umich.edu/apis/umalerts/umalerts.js' />
      <Script type='module' src='https://cdn.jsdelivr.net/npm/@umich-lib/web@latest/dist/umich-lib/umich-lib.esm.js' />
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '100%',
          gridTemplateRows: 'auto auto 1fr',
          minHeight: '100%'
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
