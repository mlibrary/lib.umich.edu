import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

function SearchEngineOptimization({data, children, titleField}) {
  const siteData = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title,
          siteUrl,
          description
        }
      }
    }
  `);
  const defaultTitle = siteData.site.siteMetadata.title;
  const { title, field_title_context, body, field_seo_keywords} = data || {};
  const metaTitle = () => {
    if (titleField && data[titleField]) {
      return data[titleField];
    }
    if (field_title_context) {
      return field_title_context;
    }
    if (title) {
      return title;
    }
    return null;
  }
  const metaDescription = () => {
    if (body && body.summary) {
      return body.summary;
    }
    return siteData.site.siteMetadata.description;
  }
  const metaKeywords = () => {
    return field_seo_keywords ? field_seo_keywords.split(', ') : [];
  }
  return (
    <>
      <title>{metaTitle() && metaTitle() !== 'Home' ? metaTitle() + ' | ' : ''}{defaultTitle}</title>
      <meta property="og:title" content={metaTitle() && metaTitle() !== 'Home' ? metaTitle() : defaultTitle} />
      <meta name="description" content={metaDescription()}/>
      <meta name="keywords" content={metaKeywords()} />
      <meta property="og:description" content={metaDescription()} />
      <meta property="og:type" content="website" />
      <meta property="twitter:description" content={metaDescription()} />
      <link rel="canonical" href={siteData.site.siteMetadata.siteUrl} />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@umich-lib/css@1.0.9/dist/umich-lib.css" />
      <script async type="text/javascript" src="https://umich.edu/apis/umalerts/umalerts.js"></script>
      {children}
    </>
  );
}

SearchEngineOptimization.propTypes = {
  data: PropTypes.object,
  children: PropTypes.object,
  titleField: PropTypes.string
};

export default SearchEngineOptimization;
