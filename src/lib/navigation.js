/**
 * Navigation Utilities
 *
 * Astro equivalent of use-navigation-branch.js.
 * Fetches primary nav (with build-time caching) and finds the branch
 * that matches a given path — used by SideNavigation on basic pages.
 */
import { fetchPrimaryNav } from './drupal.js';

/** @type {null | Promise<any[]>} */
let primaryNavCache = null;

/**
 * Returns the primary nav tree, fetching only once per build.
 * @returns {Promise<any[]>}
 */
export async function getPrimaryNav () {
  if (!primaryNavCache) {
    primaryNavCache = fetchPrimaryNav();
  }
  return primaryNavCache;
}

/**
 * Find the branch in the nav tree whose `to` is a prefix of `path`.
 * Mirrors the getSiteMapBranch logic from use-navigation-branch.js.
 *
 * @param {any[]} navTree
 * @param {string} path
 * @returns {any | null}
 */
function getSiteMapBranch (navTree, path) {
  const find = (item) => {
    return path.startsWith(item.to);
  };
  const root = navTree.find(find);
  if (!root) {
    return null;
  }
  const parent = root.children?.find(find);
  return parent || null;
}

/**
 * Get the navigation branch for a path.
 * `type === 'small'` returns the sub-branch used for HorizontalNavigation.
 *
 * @param {string} path - Current page path (e.g. "/research-and-scholarship/...")
 * @param {'large' | 'small'} [type='large']
 * @returns {Promise<any | null>}
 */
export async function getNavigationBranch (path, type = 'large') {
  const nav = await getPrimaryNav();
  const branch = getSiteMapBranch(nav, path);

  if (type === 'small') {
    if (branch?.children) {
      return branch.children.find((item) => {
        return path.includes(item.to);
      }) || null;
    }
    return null;
  }

  return branch;
}
