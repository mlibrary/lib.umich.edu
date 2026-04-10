/**
 * News Data Fetching & Processing
 *
 * Fetches news items from Drupal JSON:API and processes them into the
 * format expected by the FeaturedAndLatestNews component.
 */
import { fetchWithRetry, removeTrailingSlash, DRUPAL_URL } from './drupal.js';

/**
 * Fetch all news items from Drupal JSON:API
 */
export const fetchDrupalNews = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);
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
 * Process Drupal JSON:API media relationship data
 */
const processMediaImage = (newsNode, included) => {
  // Navigate the media image relationships like the original Gatsby structure
  const mediaImageRef = newsNode?.relationships?.field_media_image?.data;
  if (!mediaImageRef) {
    return null;
  }

  // Find the media entity in included data
  const mediaEntity = included.find((entity) => {
    return entity.type === 'media--image' && entity.id === mediaImageRef.id;
  }
  );

  if (!mediaEntity) {
    return null;
  }

  // Find the file entity referenced by the media entity
  const fileRef = mediaEntity?.relationships?.field_media_image?.data;
  if (!fileRef) {
    return null;
  }

  const fileEntity = included.find((entity) => {
    return entity.type === 'file--file' && entity.id === fileRef.id;
  }
  );

  if (!fileEntity) {
    return null;
  }

  // Create mock gatsbyImageData structure for compatibility
  // In a real scenario, you'd want to generate actual image data
  const imageUrl = fileEntity?.attributes?.uri?.url;
  if (!imageUrl) {
    return null;
  }

  return {
    localFile: {
      childImageSharp: {
        gatsbyImageData: {
          layout: 'constrained',
          placeholder: {},
          width: 920,
          height: 400, // Estimate
          images: {
            fallback: {
              src: imageUrl.startsWith('http') ? imageUrl : `https://cms.lib.umich.edu${imageUrl}`
            }
          }
        }
      }
    }
  };
};

/**
 * Process a single news node into the format expected by the component
 */
const processNewsNode = (newsNode, included) => {
  // Create fields.slug from the path alias
  const slug = newsNode?.attributes?.path?.alias || `/news/${newsNode?.attributes?.drupal_internal__nid}`;

  // Process media image
  const mediaImage = processMediaImage(newsNode, included);

  return {
    title: newsNode?.attributes?.title,
    created: newsNode?.attributes?.created,
    body: {
      summary: newsNode?.attributes?.body?.summary,
      processed: newsNode?.attributes?.body?.processed
    },
    fields: {
      slug
    },
    relationships: {
      field_media_image: mediaImage
        ? {
            relationships: {
              field_media_image: mediaImage
            }
          }
        : undefined
    }
  };
};

/**
 * Convert Drupal JSON:API response to Gatsby-style edges format
 */
export const convertToEdgesFormat = (drupalResponse) => {
  const { data, included } = drupalResponse;

  if (!data || !Array.isArray(data)) {
    return { edges: [] };
  }

  const edges = data.map((newsNode) => {
    return {
      node: processNewsNode(newsNode, included || [])
    };
  });

  return { edges };
};

/**
 * Fetch and process all news data needed for FeaturedAndLatestNews component
 */
export const fetchNewsDataForHomepage = async () => {
  try {
    const [featuredResponse, priorityResponse, recentResponse, newsLandingSlug] = await Promise.all([
      fetchFeaturedNews(),
      fetchPriorityNews(),
      fetchRecentNews(),
      fetchNewsLandingPageSlug()
    ]);

    const result = {
      featuredNews: convertToEdgesFormat(featuredResponse),
      priorityNews: convertToEdgesFormat(priorityResponse),
      recentNews: convertToEdgesFormat(recentResponse),
      newsLandingSlug
    };

    return result;
  } catch (error) {
    console.error('Error fetching news data for homepage:', error);
    return {
      featuredNews: { edges: [] },
      priorityNews: { edges: [] },
      recentNews: { edges: [] },
      newsLandingSlug: null
    };
  }
};
