/**
 * Astro Data Fetcher - Replacement for Gatsby's gatsby-source-drupal
 *
 * This module handles fetching data from Drupal JSON:API
 * and provides it to Astro pages at build time.
 */

import 'isomorphic-fetch';

const DRUPAL_URL = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu/';
const DRUPAL_REQUEST_TIMEOUT = parseInt(process.env.DRUPAL_REQUEST_TIMEOUT, 10) || 60000;

/**
 * Remove trailing slash from URL
 */
const removeTrailingSlash = (url) => {
  return url.replace(/\/$/u, '');
};

/**
 * Fetch with retry logic
 */
const fetchWithRetry = async (url, retries = 5) => {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, DRUPAL_REQUEST_TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 500 && attempt < retries) {
          // Wait before retrying (exponential backoff)
          const delay = (2 ** attempt) * 1000;
          await new Promise((resolve) => {
            setTimeout(resolve, delay);
          });
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        return await response.json();
      }
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        /* eslint-disable no-console */
        console.error(`Error fetching ${url}:`, error);
        /* eslint-enable no-console */
        throw error;
      }
      // Wait before retrying
      const delay = (2 ** attempt) * 1000;
      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
  }

  throw lastError || new Error('Fetch failed after retries');
};

/**
 * Sanitize Drupal view data (remove empty nested arrays)
 */
const sanitizeDrupalView = (data) => {
  if (Array.isArray(data)) {
    if (data[0] && !Array.isArray(data[0])) {
      return data;
    }
  }
  return null;
};

/**
 * Process Drupal navigation data into a clean structure
 */
const processDrupalNavData = (data) => {
  return data.map((item) => {
    const navItem = {
      text: item.text,
      to: item.to
    };

    if (item.description && item.description.length) {
      navItem.description = item.description;
    }

    if (item.children && item.children.length) {
      navItem.children = processDrupalNavData(item.children);
    }

    if (item.field_icon) {
      navItem.icon = item.field_icon;
    }

    return navItem;
  });
};

/**
 * Fetch primary navigation from Drupal
 */
export const fetchPrimaryNav = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const data = await fetchWithRetry(`${baseUrl}/api/nav/primary`);
  return processDrupalNavData(data[0].children);
};

/**
 * Fetch utility navigation from Drupal
 */
export const fetchUtilityNav = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const data = await fetchWithRetry(`${baseUrl}/api/nav/utility`);
  return processDrupalNavData(data[0].children);
};

/**
 * Fetch all pages from Drupal JSON:API
 */
export const fetchDrupalPages = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_panels',
    'field_panels.field_hero_template',
    'field_panels.field_hero_images',
    'field_panels.field_hero_images.field_media_image',
    'field_panels.field_card_template',
    'field_panels.field_cards',
    'field_panels.field_cards.field_media_image',
    'field_panels.field_cards.field_media_image.field_media_image',
    // Group panel relationships
    'field_panels.field_panel_group',
    'field_panels.field_panel_group.field_cards',
    'field_panels.field_panel_group.field_cards.field_media_image',
    'field_panels.field_panel_group.field_cards.field_media_image.field_media_image',
    'field_panels.field_panel_group.field_cards.field_hours_open',
    'field_panels.field_panel_group.field_cards.field_parent_location',
    'field_panels.field_panel_group.field_cards.field_parent_page',
    // Hours panel lite - direct field_cards relationship with full location data
    'field_panels.field_cards.field_hours_open',
    'field_panels.field_cards.field_parent_location',
    'field_panels.field_cards.field_parent_page',
    'field_panels.field_cards.field_floor_plan',
    'field_panels.field_cards.field_parent_location.field_hours_open',
    'field_panels.field_cards.field_parent_page.field_hours_open',
    // Link panel relationships - include machine name field
    'field_panels.field_panel_group.field_link_template',
    'field_panels.field_link_template',
    // Page-level media image (used by collecting-area hero image)
    'field_media_image',
    'field_media_image.field_media_image',
    // Collecting area taxonomy term reference
    'field_collecting_area'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/page?include=${includes}&filter[field_redirect_node][value]=0`;

  let allData = [];
  let allIncluded = [];
  let nextUrl = url;

  // Handle pagination
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

/**
 * Fetch all section pages from Drupal JSON:API
 */
export const fetchDrupalSectionPages = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);

  // Keep includes minimal - only include what exists on ALL section pages
  // Cannot include panel-specific fields like field_parent_card because
  // Not all panel types have that field (causes 400 error)
  const includes = [
    'field_design_template',
    'field_parent_page',
    'field_media_image',
    'field_panels',
    'field_panels.field_card_template',
    'field_panels.field_cards',
    'field_panels.field_cards.field_media_image',
    'field_panels.field_cards.field_media_image.field_media_image'
  ].join(',');

  const url = `${baseUrl}/jsonapi/node/section_page?include=${includes}`;

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

/**
 * Fetch all hours panel paragraphs with their full relationships
 * This is needed because we can't include panel-specific fields in the section_page query
 */
export const fetchDrupalHoursPanels = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);

  // Include all relationships needed for hours panels
  const includes = [
    'field_parent_card',
    'field_parent_card.field_hours_open',
    'field_parent_card.field_parent_location',
    'field_parent_card.field_parent_location.field_hours_open',
    'field_cards',
    'field_cards.field_hours_open',
    'field_cards.field_parent_location',
    'field_cards.field_parent_location.field_hours_open',
    'field_cards.field_room_building',
    'field_cards.field_room_building.field_hours_open',
    'field_cards.field_room_building.field_parent_location',
    'field_cards.field_room_building.field_parent_location.field_hours_open'
  ].join(',');

  const url = `${baseUrl}/jsonapi/paragraph/hours_panel?include=${includes}`;

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

/**
 * Fetch all buildings from Drupal JSON:API
 */
export const fetchDrupalBuildings = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_panels',
    'field_panels.field_card_template',
    'field_panels.field_cards',
    'field_panels.field_cards.field_media_image',
    'field_panels.field_cards.field_media_image.field_media_image'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/building?include=${includes}`;

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

/**
 * Fetch all room nodes from Drupal JSON:API
 * Rooms can use templates: visit, basic, study_space, destination_body, destination_full
 */
export const fetchDrupalRooms = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_panels',
    'field_panels.field_card_template',
    'field_panels.field_cards',
    'field_panels.field_cards.field_media_image',
    'field_panels.field_cards.field_media_image.field_media_image',
    'field_room_building',
    'field_room_building.field_hours_open',
    'field_room_building.field_parent_location',
    'field_room_building.field_parent_location.field_hours_open',
    'field_floor',
    'field_floor_plan',
    'field_hours_open',
    'field_parent_page',
    'field_media_image',
    'field_media_image.field_media_image'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/room?include=${includes}`;

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

/**
 * Fetch all location nodes from Drupal JSON:API
 * Locations can use templates: visit, full_width, study_space, destination_body, destination_full
 */
export const fetchDrupalLocations = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_panels',
    'field_panels.field_card_template',
    'field_panels.field_cards',
    'field_panels.field_cards.field_media_image',
    'field_panels.field_cards.field_media_image.field_media_image',
    'field_parent_location',
    'field_parent_location.field_hours_open',
    'field_floor_plan',
    'field_floor',
    'field_hours_open',
    'field_parent_page',
    'field_media_image',
    'field_media_image.field_media_image'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/location?include=${includes}`;

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

/**
 * Fetch all floor plan nodes from Drupal JSON:API
 * Floor plans have SVG and printable PDF file references
 */
export const fetchDrupalFloorPlans = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_svg_image',
    'field_printable_image',
    'field_room_building',
    'field_room_building.field_hours_open',
    'field_floor'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/floor_plan?include=${includes}`;

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

/**
 * Generic fetch from Drupal custom API endpoint
 */
export const fetchFromDrupal = async (endpoint) => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  return await fetchWithRetry(`${baseUrl}${endpoint}`);
};

/**
 * Fetch a single node by UUID
 */
export const fetchDrupalNodeByUuid = async (nodeType, uuid) => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/${nodeType}/${uuid}`;
  return await fetchWithRetry(url);
};

/**
 * Build-time in-memory cache for media entity lookups.
 * Persists across all pages in a single build so each UUID is only fetched once.
 */
const mediaEntityCache = new Map();

/**
 * Fetch a media entity by UUID from Drupal JSON:API.
 * Tries known media bundles (image, remote_video, file) in order.
 * Uses a plain fetch with a short timeout — NOT fetchWithRetry — because
 * a 404 (wrong bundle) should simply try the next bundle immediately, not be retried.
 * Results are cached for the duration of the build.
 */
export const fetchMediaEntity = async (uuid) => {
  if (mediaEntityCache.has(uuid)) {
    return mediaEntityCache.get(uuid);
  }

  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  for (const bundle of ['image', 'remote_video', 'file']) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000);
      const response = await fetch(
        `${baseUrl}/jsonapi/media/${bundle}/${uuid}?include=field_media_image,field_media_file`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (response.ok) {
        const result = await response.json();
        if (result?.data) {
          mediaEntityCache.set(uuid, result);
          return result;
        }
      }
    } catch {
      // Timeout or network error — try next bundle
    }
  }

  mediaEntityCache.set(uuid, null);
  return null;
};

export {
  DRUPAL_URL,
  removeTrailingSlash,
  sanitizeDrupalView,
  fetchWithRetry
};
