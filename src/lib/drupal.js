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
export async function fetchPrimaryNav () {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const data = await fetchWithRetry(`${baseUrl}/api/nav/primary`);
  return processDrupalNavData(data[0].children);
}

/**
 * Fetch utility navigation from Drupal
 */
export async function fetchUtilityNav () {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const data = await fetchWithRetry(`${baseUrl}/api/nav/utility`);
  return processDrupalNavData(data[0].children);
}

/**
 * Fetch staff data from Drupal
 */
export async function fetchStaff () {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const data = await fetchWithRetry(`${baseUrl}/api/staff`);
  return data;
}

/**
 * Fetch all pages from Drupal JSON:API
 */
export async function fetchDrupalPages () {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/page?include=field_design_template&filter[field_redirect_node][value]=0`;

  let allData = [];
  let nextUrl = url;

  // Handle pagination
  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allData = allData.concat(response.data);
    nextUrl = response.links?.next?.href || null;
  }

  return allData;
}

/**
 * Fetch all section pages from Drupal JSON:API
 */
export async function fetchDrupalSectionPages () {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/section_page?include=field_design_template`;

  let allData = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allData = allData.concat(response.data);
    nextUrl = response.links?.next?.href || null;
  }

  return allData;
}

/**
 * Fetch all buildings from Drupal JSON:API
 */
export async function fetchDrupalBuildings () {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/building?include=field_design_template`;

  let allData = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allData = allData.concat(response.data);
    nextUrl = response.links?.next?.href || null;
  }

  return allData;
}

/**
 * Fetch all news items from Drupal JSON:API
 */
export async function fetchDrupalNews () {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/news?include=field_design_template`;

  let allData = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allData = allData.concat(response.data);
    nextUrl = response.links?.next?.href || null;
  }

  return allData;
}

/**
 * Fetch all events and exhibits from Drupal JSON:API
 */
export async function fetchDrupalEvents () {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/events_and_exhibits?include=field_design_template,field_event_type`;

  let allData = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    allData = allData.concat(response.data);
    nextUrl = response.links?.next?.href || null;
  }

  return allData;
}

/**
 * Generic fetch from Drupal custom API endpoint
 */
export async function fetchFromDrupal (endpoint) {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  return await fetchWithRetry(`${baseUrl}${endpoint}`);
}

/**
 * Fetch a single node by UUID
 */
export async function fetchDrupalNodeByUuid (nodeType, uuid) {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/${nodeType}/${uuid}`;
  return await fetchWithRetry(url);
}

export {
  DRUPAL_URL,
  removeTrailingSlash,
  sanitizeDrupalView,
  fetchWithRetry
};
