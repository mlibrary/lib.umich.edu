import React from 'react';

export { wrapPageElement } from './gatsby-shared';

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'en' });
  setHeadComponents([
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@umich-lib/css@1.0.9/dist/umich-lib.css' key='umich-lib-stylesheet' />,
    <link
      key='umich-lib-preload'
      rel='preload'
      href='https://cdn.jsdelivr.net/npm/@umich-lib/web@latest/dist/umich-lib/umich-lib.esm.js'
      as='script'
    />
  ]);
};
