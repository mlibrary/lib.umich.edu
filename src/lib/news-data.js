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
  const mediaImageRef = newsNode?.relationships?.field_media_image?.data;
  if (!mediaImageRef) return null;

  const mediaEntity = included.find(
    (entity) => entity.type === 'media--image' && entity.id === mediaImageRef.id
  );
  if (!mediaEntity) return null;

  const fileRef = mediaEntity?.relationships?.field_media_image?.data;
  if (!fileRef) return null;

  const fileEntity = included.find(
    (entity) => entity.type === 'file--file' && entity.id === fileRef.id
  );
  if (!fileEntity) return null;

  const rawUrl = fileEntity?.attributes?.uri?.url;
  if (!rawUrl) return null;

  const src = rawUrl.startsWith('http')
    ? rawUrl
    : `${process.env.DRUPAL_URL || 'https://cms.lib.umich.edu'}${rawUrl}`;

  return { src, alt: newsNode?.attributes?.title || '' };
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
    image: mediaImage ?? undefined
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
 * Fetch and process all news data needed for the News Landing page.
 *
 * Returns:
 * - mainNews: featured (field_featured_news_item=true) + rest, all with field_news_type=news_main
 * - libraryUpdates: field_news_type=library_updates with design template "news"
 *
 * Each item has: { title, subtitle (formatted date), href, image?, description? }
 */
export const fetchNewsDataForLanding = async () => {
  try {
    const { data: allNews, included } = await fetchDrupalNews();

    if (!allNews || !Array.isArray(allNews)) {
      return { mainNews: [], libraryUpdates: [] };
    }

    const processForCard = (newsNode) => {
      const slug = newsNode?.attributes?.path?.alias
        || `/news/${newsNode?.attributes?.drupal_internal__nid}`;
      const mediaImage = processMediaImage(newsNode, included || []);
      const created = newsNode?.attributes?.created;
      const subtitle = created
        ? new Date(created).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        : undefined;

      return {
        title: newsNode?.attributes?.title,
        subtitle,
        href: slug,
        image: mediaImage ?? undefined,
        description: newsNode?.attributes?.body?.summary || undefined
      };
    };

    // Sort all news by created date descending
    const sorted = [...allNews].sort((nodeA, nodeB) => {
      return new Date(nodeB.attributes?.created) - new Date(nodeA.attributes?.created);
    });

    // Main news: field_news_type = "news_main", featured first then rest
    const mainNewsNodes = sorted.filter((node) => {
      return node.attributes?.field_news_type === 'news_main';
    });
    const featuredMain = mainNewsNodes.filter((node) => {
      return node.attributes?.field_featured_news_item === true;
    });
    const restMain = mainNewsNodes.filter((node) => {
      return node.attributes?.field_featured_news_item !== true;
    });
    const mainNews = [...featuredMain, ...restMain].map(processForCard);

    // Library updates: field_news_type = "library_updates" with design template "news"
    const libraryUpdates = sorted
      .filter((node) => {
        if (node.attributes?.field_news_type !== 'library_updates') {
          return false;
        }
        // Check design template machine name
        const templateRef = node.relationships?.field_design_template?.data;
        if (!templateRef) {
          return true; // include if we can't check
        }
        const templateEntity = (included || []).find((entity) => {
          return entity.id === templateRef.id;
        });
        const machineName = templateEntity?.attributes?.field_machine_name;
        return !machineName || machineName === 'news';
      })
      .map(processForCard);

    return { mainNews, libraryUpdates };
  } catch (error) {
    console.error('Error fetching news data for landing:', error);
    return { mainNews: [], libraryUpdates: [] };
  }
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
