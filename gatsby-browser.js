export { wrapPageElement } from './gatsby-shared';

export const onRouteUpdate = ({ location, prevLocation }) => {
  const newPath = location.pathname;
  const oldPath = prevLocation ? prevLocation.pathname : null;

  /**
   * We shouldn't handle paths that are only
   * query params. eg, Staff Directory or
   * Find a Specialist searches. Otherwise the
   * focus would change on every key stroke.
   *
   * Only move focus to the page heading on actual client-side navigations,
   * not on the initial hydration (prevLocation is null then). Calling focus()
   * during hydration scrolls the H1 into view, causing the visible jump.
   *
   * We also defer via requestAnimationFrame so React 19 concurrent rendering
   * has time to finish painting the new page's DOM before we query for the H1.
  */
  if (prevLocation && newPath !== oldPath) {
    requestAnimationFrame(() => {
      const dataPageHeading = document.querySelector('[data-page-heading]');
      const h1 = document.querySelector('h1');
      const pageHeading = dataPageHeading ? dataPageHeading : h1;

      if (pageHeading) {
        pageHeading.setAttribute('tabindex', '-1');
        pageHeading.classList.add('focus');
        pageHeading.focus();
      }
    });
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
/**
 * On initial hydration, prevRouterProps is null — don't override the browser's
 * restored scroll position. Only scroll to top on actual client-side navigations.
 * We also let the hash-scroll logic in onRouteUpdate handle anchor links
 * with the location.hash check, so we return false if there's a hash in the URL.
 */

export const shouldUpdateScroll = ({ prevRouterProps, routerProps: { location } }) => {
  if (!prevRouterProps) {
    console.log('initial load, do not scroll');
    return false;
  }

  if (location.hash) {
    console.log('hash in URL, do not scroll');
    return false;
  }
  console.log('scroll to top');
  window.scrollTo(0, 0);
  return false;
};
