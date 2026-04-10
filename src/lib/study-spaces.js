/**
 * Study Spaces Data Fetcher
 *
 * Fetches and processes room and location nodes with the study_space
 * design template, matching the Gatsby find-study-space GraphQL query.
 */
import { DRUPAL_URL, fetchWithRetry, removeTrailingSlash } from './drupal.js';
import { processDrupalNode } from './page-generator.js';

/**
 * Fetch all rooms from Drupal JSON:API
 */
const fetchDrupalRooms = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_media_image',
    'field_media_image.field_media_image',
    'field_room_building',
    'field_room_building.field_building_campus'
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
 * Fetch all locations from Drupal JSON:API
 */
const fetchDrupalLocations = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
  const includes = [
    'field_design_template',
    'field_media_image',
    'field_media_image.field_media_image',
    'field_parent_location',
    'field_parent_location.field_building_campus'
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
 * Process a raw Drupal node into a study space object suitable for the
 * client-side filter component. Only the fields actually used by the
 * find-study-space UI are included to keep the serialised payload small.
 */
const toStudySpace = (node, included) => {
  const processed = processDrupalNode(node, included);
  const { attributes, relationships } = processed;
  const drupalBaseUrl = (process.env.DRUPAL_URL || 'https://cms.lib.umich.edu').replace(/\/$/u, '');

  // Resolve image URL
  let imageUrl = null;
  let imageAlt = '';
  if (relationships.field_media_image) {
    imageUrl = relationships.field_media_image.imageUrl || null;
    imageAlt = relationships.field_media_image.imageAlt || relationships.field_media_image.field_media_image?.alt || '';

    // If imageUrl is still null, try to resolve from nested file entity
    if (!imageUrl && relationships.field_media_image.relationships?.field_media_image?.uri?.url) {
      const rawUrl = relationships.field_media_image.relationships.field_media_image.uri.url;
      imageUrl = rawUrl.startsWith('/') ? `${drupalBaseUrl}${rawUrl}` : rawUrl;
    }
  }

  // Determine parent location / building
  const typeName = node.type.replace('--', '__'); // node--room → node__room
  let building = '';
  let campus = '';

  if (typeName === 'node__location' && relationships.field_parent_location) {
    building = relationships.field_parent_location.title || '';
    campus = relationships.field_parent_location.relationships?.field_building_campus?.field_campus_official_name || '';
  } else if (typeName === 'node__room' && relationships.field_room_building) {
    building = relationships.field_room_building.title || '';
    campus = relationships.field_room_building.relationships?.field_building_campus?.field_campus_official_name || '';
  }

  return {
    title: attributes.title,
    slug: processed.slug,
    typeName,
    bodySummary: attributes.body?.summary || '',
    spaceFeatures: attributes.field_space_features || [],
    noiseLevel: attributes.field_noise_level || '',
    building,
    campus,
    imageUrl,
    imageAlt
  };
};

/**
 * Fetch all study spaces (rooms + locations with the study_space template).
 * Returns a serialisable array ready to pass as a prop to the React island.
 */
export const fetchStudySpaces = async () => {
  const [rooms, locations] = await Promise.all([
    fetchDrupalRooms(),
    fetchDrupalLocations()
  ]);

  const isStudySpace = (node, included) => {
    const templateRef = node.relationships?.field_design_template?.data;
    if (!templateRef) {
      return false;
    }
    const templateEntity = included.find((item) => {
      return item.id === templateRef.id && item.type === templateRef.type;
    });
    return templateEntity?.attributes?.field_machine_name === 'study_space';
  };

  const studySpaceRooms = rooms.data
    .filter((node) => {
      return isStudySpace(node, rooms.included);
    })
    .map((node) => {
      return toStudySpace(node, rooms.included);
    });

  const studySpaceLocations = locations.data
    .filter((node) => {
      return isStudySpace(node, locations.included);
    })
    .map((node) => {
      return toStudySpace(node, locations.included);
    });

  return [...studySpaceLocations, ...studySpaceRooms];
};
