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
    if (!field_seo_keywords) {
      return null;
    }
    return (
      <meta name="keywords" content={field_seo_keywords} />
    );
  }
  const siteTitle = () => {
    if (!metaTitle() || metaTitle() === 'Home') {
      return defaultTitle;
    }
    return `${metaTitle()} | ${defaultTitle}`;
  };
  return (
    <>
      <title>{siteTitle()}</title>
      <meta property="og:title" content={metaTitle() && metaTitle() !== 'Home' ? metaTitle() : defaultTitle} />
      <meta name="description" content={metaDescription()}/>
      {metaKeywords()}
      <meta property="og:description" content={metaDescription()} />
      <meta property="og:type" content="website" />
      <meta property="twitter:description" content={metaDescription()} />
      <link rel="canonical" href={siteData.site.siteMetadata.siteUrl} />
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
