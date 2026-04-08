export { wrapPageElement } from './gatsby-shared';

/**
 * Gatsby injects #gatsby-announcer directly into <body>, outside any ARIA
 * landmark. This wraps it in an an <aside> for accessibility
 */
export const onInitialClientRender = () => {
  const announcer = document.getElementById('gatsby-announcer');

  if (announcer && !announcer.closest('aside')) {
    const aside = document.createElement('aside');
    aside.setAttribute('aria-label', 'Page Navigation Announcements');
    announcer.parentNode.insertBefore(aside, announcer);
    aside.appendChild(announcer);
  }
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
   * Let content load first before scrolling.
   */
  if (location.hash) {
    const element = document.querySelector(`${location.hash}`);

    if (element) {
      const stickyHeader = document.querySelector('#dateViewerBar');
      const headerHeight = stickyHeader ? stickyHeader.offsetHeight : 0;
      window.scrollTo({
        behavior: 'smooth',
        top: element.offsetTop - headerHeight
      });
    }
  }
};

export const shouldUpdateScroll = () => {
  window.scrollTo(0, 0);
  return false;
};
