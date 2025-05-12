import React from 'react';

export { wrapPageElement } from './gatsby-shared';

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'en' });
  setHeadComponents([
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@umich-lib/design-system@latest/dist/umich-lib.min.css' key='umich-lib-stylesheet' />,
    <link
      key='umich-lib-preload'
      rel='preload'
      href='https://cdn.jsdelivr.net/npm/@umich-lib/design-system@latest/dist/umich-lib-components.min.js'
      as='script'
    />
  ]);
};
