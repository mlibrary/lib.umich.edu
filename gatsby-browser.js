import React from 'react';
import SkipLinks from './src/components/skip-links';

export const onClientEntry = () => {
  const {
    applyPolyfills,
    defineCustomElements,
  } = require('@umich-lib/web/loader');

  applyPolyfills().then(() => {
    defineCustomElements(window);
  });
};

export const wrapPageElement = ({ element }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <React.Fragment>
      <div
        css={{
          minHeight: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          gridTemplateColumns: '100%',
        }}
      >
        <div>
          <SkipLinks />
          <m-universal-header></m-universal-header>
        </div>
        {element}
      </div>
      <m-chat id="chat"></m-chat>
    </React.Fragment>
  );
};

export const onRouteUpdate = ({ location, prevLocation }) => {
  const newPath = location.pathname;
  const oldPath = prevLocation ? prevLocation.pathname : null;

  /**
   * We shouldn't handle paths that are only
   * query params. eg, Staff Directory or
   * Find a Specialist searches. Otherwise the
   * focus would change on every key stroke.
   *
   * Is there a new path?
   */
  if (newPath !== oldPath) {
    const dataPageHeading = document.querySelector('[data-page-heading]');
    const h1 = document.querySelector('h1');
    const pageHeading = dataPageHeading ? dataPageHeading : h1;

    if (pageHeading) {
      pageHeading.setAttribute('tabindex', '-1');
      pageHeading.classList.add('focus');
      pageHeading.focus();
    }
  }

  /**
   * Will scroll to the position of the hash
   * if it exists on an element on the page.
   */
  if (location && location.hash) {
    const element = document.querySelector(`${location.hash}`);
    const padding = 64;

    if (element) {
      window.scrollTo({
        top: element.offsetTop - padding,
        behavior: 'smooth',
      });
    }
  }
};

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  if (location?.state?.preserveScroll) {
    return false;
  }

  return true;
};
