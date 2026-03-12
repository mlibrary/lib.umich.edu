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
   * We defer via requestAnimationFrame so React 19 concurrent rendering
   * has time to finish painting the new page's DOM before we query for the H1.
   *
   * We use focus({ preventScroll: true }) so the browser doesn't jump to the
   * heading — scroll position is managed separately by shouldUpdateScroll.
   * This also prevents the scroll jump on initial hydration that previously
   * occurred when focus() was called without preventScroll.
  */
  if (newPath !== oldPath) {
    requestAnimationFrame(() => {
      const dataPageHeading = document.querySelector('[data-page-heading]');
      const h1 = document.querySelector('h1');
      const pageHeading = dataPageHeading ? dataPageHeading : h1;

      if (pageHeading) {
        pageHeading.setAttribute('tabindex', '-1');
        pageHeading.classList.add('focus');
        pageHeading.focus({ preventScroll: true });
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
 * When a navigation carries state.preserveScroll (e.g. URL-based search pages
 * like Staff Directory or Find a Specialist), skip the scroll so the page
 * doesn't jump back to the top on every keystroke.
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

  if (location.state?.preserveScroll) {
    console.log('preserveScroll flag set, do not scroll');
    return false;
  }

  console.log('scroll to top');
  window.scrollTo(0, 0);
  return false;
};
