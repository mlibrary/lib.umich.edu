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
   * Is there a new path?
   * Only move focus to the page heading on actual client-side navigations,
   * not on the initial hydration (prevLocation is null then). Calling focus()
   * during hydration scrolls the H1 into view, causing the visible jump.
  */
  if (prevLocation && newPath !== oldPath) {
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
/**
 * On initial hydration, prevRouterProps is null — don't override the browser's
 * restored scroll position. Only scroll to top on actual client-side navigations.
 * We also let the hash-scroll logic in onRouteUpdate handle anchor links
 * with the location.hash check, so we return false if there's a hash in the URL.
 * Additionally, avoid forcing scroll-to-top when only the query string changes
 * (same pathname) or when the navigation explicitly opts out via
 * location.state.preserveScroll.
 */

export const shouldUpdateScroll = ({ prevRouterProps, routerProps: { location } }) => {
  // Don't interfere with the browser's initial scroll restoration.
  if (!prevRouterProps) {
    return false;
  }

  // Let hash-based scrolling be handled in onRouteUpdate.
  if (location.hash) {
    return false;
  }

  // Honor explicit request to preserve scroll position.
  if (location.state && location.state.preserveScroll) {
    return false;
  }

  const prevPathname = prevRouterProps.location.pathname;
  const nextPathname = location.pathname;

  // Don't scroll to top if the pathname hasn't changed (e.g., query-string-only updates).
  if (prevPathname === nextPathname) {
    return false;
  }

  window.scrollTo(0, 0);
  return false;
};
