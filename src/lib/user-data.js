/**
 * Cached Drupal User Fetch
 *
 * Module-level cache ensures ALL users are fetched only once per build,
 * rather than per-page. This is critical for collecting-area pages (~90+)
 * that each need to look up contacts from the full user list.
 */
import { DRUPAL_URL, fetchWithRetry, removeTrailingSlash } from './drupal.js';

let cachedUsersWithImages = null;
let cachedUsersBasic = null;
let cachedUsersForProfiles = null;

/**
 * Fetch all Drupal users WITH media image includes (for collecting-area contacts).
 * Cached across all page renders during the build.
 */
export async function getAllUsersWithImages() {
  if (cachedUsersWithImages) return cachedUsersWithImages;

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

  cachedUsersWithImages = { users: allUsers, included: allIncluded };
  return cachedUsersWithImages;
}

/**
 * Fetch all Drupal users WITHOUT includes (for specialist page).
 * Cached across all page renders during the build.
 */
export async function getAllUsersBasic() {
  if (cachedUsersBasic) return cachedUsersBasic;

  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const allUsers = [];
  let nextUrl = `${baseUrl}/jsonapi/user/user`;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allUsers.push(...(response.data || []));
    nextUrl = response.links?.next?.href || null;
  }

  cachedUsersBasic = allUsers;
  return cachedUsersBasic;
}

/**
 * Fetch all Drupal users WITH full profile relationship includes.
 * Includes: media image, department, name pronunciation, office location.
 * Cached across all page renders during the build.
 */
export async function getAllUsersForProfiles() {
  if (cachedUsersForProfiles) return cachedUsersForProfiles;

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

  cachedUsersForProfiles = { users: allUsers, included: allIncluded };
  return cachedUsersForProfiles;
}
