/**
 * Events Data Fetching
 *
 * Fetches events and exhibits from Drupal JSON:API.
 */
import { DRUPAL_URL, fetchWithRetry, removeTrailingSlash } from './drupal.js';

/**
 * Fetch all events and exhibits from Drupal JSON:API
 */
export const fetchDrupalEvents = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_event_type',
    'field_event_series',
    'field_media_image',
    'field_media_image.field_media_image',
    'field_event_building',
    'field_event_room',
    'field_event_room.field_floor',
    'field_library_contact',
    'field_non_library_event_contact'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/events_and_exhibits?include=${includes}`;

  let allData = [];
  let included = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allData = allData.concat(response.data);
    if (response.included) {
      included = included.concat(response.included);
    }
    nextUrl = response.links?.next?.href || null;
  }

  return { data: allData, included };
};
