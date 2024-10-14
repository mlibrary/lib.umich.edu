import React from 'react';
import SkipLinks from './src/components/skip-links';
import { Script } from 'gatsby';

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <Script async type='text/javascript' src='https://umich.edu/apis/umalerts/umalerts.js' />
      <Script
        type='module'
        src='https://cdn.jsdelivr.net/npm/@umich-lib/web@latest/dist/umich-lib/umich-lib.esm.js'
        strategy='onLoad'
        onLoad={() => {
          return console.log('success');
        }}
        onError={() => {
          return console.log('sadness');
        }}
      />
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
