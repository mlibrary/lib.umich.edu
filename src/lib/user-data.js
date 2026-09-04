/**
 * Cached Drupal User Fetch
 *
 * Module-level cache ensures ALL users are fetched only once per build,
 * rather than per-page. This is critical for collecting-area pages (~90+)
 * that each need to look up contacts from the full user list.
 */
import { DRUPAL_URL, fetchWithRetry, removeTrailingSlash } from './drupal.js';
import { onceAsync } from './build-cache.js';

/**
 * Fetch all Drupal users WITH media image includes (for collecting-area contacts).
 * Cached across all page renders during the build.
 */
export const getAllUsersWithImages = onceAsync(async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const allUsers = [];
  const allIncluded = [];
  let nextUrl = `${baseUrl}/jsonapi/user/user?include=field_media_image,field_media_image.field_media_image`;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allUsers.push(...(response.data || []));
    if (response.included) {
      allIncluded.push(...response.included);
    }
    nextUrl = response.links?.next?.href || null;
  }

  return { users: allUsers, included: allIncluded };
});

/**
 * Fetch all Drupal users WITHOUT includes (for specialist page).
 * Cached across all page renders during the build.
 */
export const getAllUsersBasic = onceAsync(async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const allUsers = [];
  let nextUrl = `${baseUrl}/jsonapi/user/user`;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allUsers.push(...(response.data || []));
    nextUrl = response.links?.next?.href || null;
  }

  return allUsers;
});

/**
 * Fetch all Drupal users WITH full profile relationship includes.
 * Includes: media image, department, name pronunciation, office location.
 * Cached across all page renders during the build.
 */
export const getAllUsersForProfiles = onceAsync(async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_media_image',
    'field_media_image.field_media_image',
    'field_user_department',
    'field_name_pronunciation',
    'field_office_location'
  ].join(',');

  const allUsers = [];
  const allIncluded = [];
  let nextUrl = `${baseUrl}/jsonapi/user/user?include=${includes}`;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allUsers.push(...(response.data || []));
    if (response.included) {
      allIncluded.push(...response.included);
    }
    nextUrl = response.links?.next?.href || null;
  }

  return { users: allUsers, included: allIncluded };
});
