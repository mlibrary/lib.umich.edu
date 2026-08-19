/**
 * Staff Data Fetching
 *
 * Fetches staff, staff images, departments, and the staff directory slug
 * from Drupal JSON:API.
 */
import { DRUPAL_URL, fetchWithRetry, removeTrailingSlash } from './drupal.js';

/**
 * Fetch staff data from Drupal
 */
export const fetchStaff = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const data = await fetchWithRetry(`${baseUrl}/api/staff`);
  return data;
};

/**
 * Fetch staff profile images from Drupal JSON:API
 *
 * Queries media/image entities directly to get image URLs and alt text.
 * Returns a map of drupal_internal__mid → { url, alt }.
 */
export const fetchStaffImages = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const fields = 'fields[media--image]=drupal_internal__mid,field_media_image&fields[file--file]=uri';
  const url = `${baseUrl}/jsonapi/media/image?include=field_media_image&${fields}`;

  let allData = [];
  let allIncluded = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allData = allData.concat(response.data || []);
    if (response.included) {
      allIncluded = allIncluded.concat(response.included);
    }
    nextUrl = response.links?.next?.href || null;
  }

  // Build lookup map for included file entities
  const includedById = {};
  for (const item of allIncluded) {
    includedById[item.id] = item;
  }

  // Build map of drupal_internal__mid → { url, alt }
  const staffImages = {};
  for (const media of allData) {
    const mid = media.attributes?.drupal_internal__mid;
    if (!mid) continue;

    // Alt text is stored in the relationship meta (not in media attributes)
    const alt = media.relationships?.field_media_image?.data?.meta?.alt || '';

    const fileRef = media.relationships?.field_media_image?.data;
    if (!fileRef) continue;

    const file = includedById[fileRef.id];
    if (!file) continue;

    const fileUrl = file.attributes?.uri?.url;
    if (!fileUrl) continue;

    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${baseUrl}${fileUrl}`;
    staffImages[String(mid)] = { url: fullUrl, alt };
  }

  return staffImages;
};

/**
 * Fetch the path alias of the staff directory page.
 * Uses a targeted filtered query to avoid fetching all pages.
 */
export const fetchStaffDirectorySlug = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/page?include=field_design_template&filter[field_design_template.field_machine_name]=staff_directory&fields[node--page]=path&page[limit]=1`;
  try {
    const response = await fetchWithRetry(url);
    return response.data?.[0]?.attributes?.path?.alias || '/staff-directory';
  } catch {
    return '/staff-directory';
  }
};

/**
 * Fetch all department nodes from Drupal JSON:API
 * Matches the departmentFragment relationships: field_department_head (user),
 * field_media_file (org chart), field_panels, field_design_template
 */
export const fetchDrupalDepartments = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  // Department panels only use link and text panels (no card/media sub-fields).
  // Including field_panels.field_card_template or field_panels.field_cards on
  // node/department returns a 400 because those fields don't exist on those panel types.
  const includes = [
    'field_design_template',
    'field_department_head',
    'field_media_file',
    'field_media_file.field_media_file',
    'field_panels'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/department?include=${includes}`;

  let allData = [];
  let allIncluded = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allData = allData.concat(response.data);
    if (response.included) {
      allIncluded = allIncluded.concat(response.included);
    }
    nextUrl = response.links?.next?.href || null;
  }

  return { data: allData, included: allIncluded };
};
