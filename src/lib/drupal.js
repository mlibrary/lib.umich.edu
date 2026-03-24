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

/**
 * Generic fetch from Drupal custom API endpoint
 */
export const fetchFromDrupal = async (endpoint) => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  return await fetchWithRetry(`${baseUrl}${endpoint}`);
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

/**
 * Fetch specialist taxonomy terms from Drupal JSON:API
 *
 * Fetches all 4 taxonomy vocabularies used by the specialist page:
 *   - taxonomy_term/health_sciences
 *   - taxonomy_term/academic_discipline
 *   - taxonomy_term/collecting_areas
 *   - taxonomy_term/library_expertise
 *
 * Each includes field_synonym and user__user relationships, plus
 * field_health_sciences_category for health_sciences terms.
 *
 * Returns { healthSciences, academicDiscipline, collectingAreas, libraryExpertise }
 * where each value is an array of taxonomy term objects from JSON:API.
 */
export const fetchSpecialistTaxonomies = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);

  const fetchTaxonomy = async (vocabulary, extraIncludes = []) => {
    // NOTE: user__user is NOT included here. In Drupal's JSON:API, you cannot include
    // reverse relationships (users → taxonomy terms). gatsby-source-drupal synthesized
    // that back-reference automatically. We rebuild it below by scanning user relationships.
    const includes = ['field_synonym', ...extraIncludes].join(',');
    const url = `${baseUrl}/jsonapi/taxonomy_term/${vocabulary}?include=${includes}`;

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

    return { data: allData, included: allIncluded };
  };

  // Fetch taxonomy terms and all users in parallel.
  // Users are fetched without a fields restriction so their relationship objects
  // are present — we need them to build the reverse term→user index.
  const [
    [healthSciences, academicDiscipline, collectingAreas, libraryExpertise],
    users
  ] = await Promise.all([
    Promise.all([
      fetchTaxonomy('health_sciences', ['field_health_sciences_category']),
      fetchTaxonomy('academic_discipline'),
      fetchTaxonomy('collecting_areas'),
      fetchTaxonomy('library_expertise'),
    ]),
    (async () => {
      const allUsers = [];
      let nextUrl = `${baseUrl}/jsonapi/user/user`;
      while (nextUrl) {
        const response = await fetchWithRetry(nextUrl);
        allUsers.push(...(response.data || []));
        nextUrl = response.links?.next?.href || null;
      }
      return allUsers;
    })()
  ]);

  return { healthSciences, academicDiscipline, collectingAreas, libraryExpertise, users };
};

export {
  DRUPAL_URL,
  removeTrailingSlash,
  sanitizeDrupalView,
  fetchWithRetry
};
