/**
 * News Data Processing Utilities
 *
 * Functions to process Drupal JSON:API news data into the format
 * expected by the FeaturedAndLatestNews component
 */

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
  // Import here to avoid circular dependency
  const {
    fetchFeaturedNews,
    fetchPriorityNews,
    fetchRecentNews,
    fetchNewsLandingPageSlug
  } = await import('./drupal.js');

  try {
    console.log('news-data: Starting to fetch news data...');
    const [featuredResponse, priorityResponse, recentResponse, newsLandingSlug] = await Promise.all([
      fetchFeaturedNews(),
      fetchPriorityNews(),
      fetchRecentNews(),
      fetchNewsLandingPageSlug()
    ]);

    console.log('news-data: Raw responses:', {
      featured: featuredResponse.data.length,
      priority: priorityResponse.data.length,
      recent: recentResponse.data.length,
      newsLanding: newsLandingSlug
    });

    const result = {
      featuredNews: convertToEdgesFormat(featuredResponse),
      priorityNews: convertToEdgesFormat(priorityResponse),
      recentNews: convertToEdgesFormat(recentResponse),
      newsLandingSlug
    };

    console.log('news-data: Processed data:', {
      featuredCount: result.featuredNews.edges.length,
      priorityCount: result.priorityNews.edges.length,
      recentCount: result.recentNews.edges.length
    });

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
