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
 * Fetch staff data from Drupal
 */
export const fetchStaff = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const data = await fetchWithRetry(`${baseUrl}/api/staff`);
  return data;
};

/**
 * Test function to fetch a specific media entity to understand its structure
 */
export const debugMediaEntity = async (mediaId) => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  try {
    // Fetch the specific media entity with all its relationships
    const url = `${baseUrl}/jsonapi/media/image/${mediaId}?include=field_media_image`;
    console.log('Fetching media entity:', url);

    const response = await fetchWithRetry(url);
    console.log('Media entity response:', JSON.stringify(response, null, 2));

    return response;
  } catch (error) {
    console.error('Error fetching media entity:', error);
    return null;
  }
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
    'field_panels.field_link_template'
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
  // not all panel types have that field (causes 400 error)
  const includes = [
    'field_design_template',
    'field_parent_page',
    'field_media_image',
    'field_panels'
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
  const url = `${baseUrl}/jsonapi/node/building?include=field_design_template`;

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
 * Fetch all news items from Drupal JSON:API
 */
export const fetchDrupalNews = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  // Include the same relationships as the original Gatsby newsFragment
  const includes = [
    'field_design_template',
    'field_media_image',
    'field_media_image.field_media_image'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/news?include=${includes}`;

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

/**
 * Fetch all events and exhibits from Drupal JSON:API
 */
export const fetchDrupalEvents = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  // Remove field filtering - get all fields
  const url = `${baseUrl}/jsonapi/node/events_and_exhibits?include=field_design_template,field_event_type`;

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

  // Process relationships to match Gatsby GraphQL structure
  const processedData = allData.map((event) => {
    const processedEvent = { ...event };

    // Process design template relationship
    if (event.relationships?.field_design_template?.data?.id) {
      const designTemplate = included.find((item) => {
        return item.id === event.relationships.field_design_template.data.id;
      }
      );
      if (designTemplate) {
        processedEvent.relationships.field_design_template = designTemplate;
      }
    }

    // Process event type relationship
    if (event.relationships?.field_event_type?.data?.id) {
      const eventType = included.find((item) => {
        return item.id === event.relationships.field_event_type.data.id;
      }
      );
      if (eventType) {
        processedEvent.relationships.field_event_type = eventType;
      }
    }

    // // Debug: Log available fields for first few events
    // If (allData.indexOf(event) < 2) {
    //   Console.log(`\n=== Event ${allData.indexOf(event)} Debug ===`);
    //   Console.log('Event ID:', event.id);
    //   Console.log('Event type:', event.type);
    //   Console.log('Event fields:', Object.keys(event));
    //   Console.log('Event attributes keys:', Object.keys(event.attributes || {}));
    //   Console.log('Event attributes:', event.attributes);
    //   Console.log('Looking for date fields containing "date":',
    //     Object.keys(event.attributes || {}).filter((key) => {
    //       Return key.includes('date');
    //     }));
    //   Console.log('=== End Event Debug ===\n');
    // }

    return processedEvent;
  });

  return processedData;
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
 * Fetch featured news for homepage (field_featured_news_item = true)
 */
export const fetchFeaturedNews = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_media_image',
    'field_media_image.field_media_image'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/news?include=${includes}&filter[field_featured_news_item][value]=1&sort=-created&page[limit]=1`;
  
  const response = await fetchWithRetry(url);
  return { data: response.data, included: response.included || [] };
};

/**
 * Fetch priority news for homepage (field_priority_for_homepage = true, field_featured_news_item = false)
 */
export const fetchPriorityNews = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_media_image',
    'field_media_image.field_media_image'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/news?include=${includes}&filter[field_priority_for_homepage][value]=1&filter[field_featured_news_item][value]=0&sort=-created&page[limit]=5`;
  
  const response = await fetchWithRetry(url);
  return { data: response.data, included: response.included || [] };
};

/**
 * Fetch recent news for homepage (field_priority_for_homepage = false, field_featured_news_item = false)
 */
export const fetchRecentNews = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_media_image',
    'field_media_image.field_media_image'
  ].join(',');
  const url = `${baseUrl}/jsonapi/node/news?include=${includes}&filter[field_priority_for_homepage][value]=0&filter[field_featured_news_item][value]=0&sort=-created&page[limit]=5`;
  
  const response = await fetchWithRetry(url);
  return { data: response.data, included: response.included || [] };
};

/**
 * Fetch the news landing page slug
 */
export const fetchNewsLandingPageSlug = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const url = `${baseUrl}/jsonapi/node/page?include=field_design_template&filter[field_design_template.field_machine_name][value]=news_landing`;
  
  const response = await fetchWithRetry(url);
  const page = response.data?.[0];
  return page?.attributes?.path?.alias || null;
};

export {
  DRUPAL_URL,
  removeTrailingSlash,
  sanitizeDrupalView,
  fetchWithRetry,
  fetchFeaturedNews,
  fetchPriorityNews,
  fetchRecentNews,
  fetchNewsLandingPageSlug
};
