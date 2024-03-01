import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

function SearchEngineOptimization ({ data, children, titleField }) {
  const siteData = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title,
          siteUrl,
          description,
        }
      }
    }
  `);
  const defaultTitle = siteData.site.siteMetadata.title;
  const { title, field_title_context, body, field_seo_keywords, fields, relationships } = data || {};

  const metaImage = () => {
    if (relationships.field_media_image.relationships.field_media_image.localFile.childImageSharp.gatsbyImageData.images.fallback.src) {
      return relationships.field_media_image.relationships.field_media_image.localFile.childImageSharp.gatsbyImageData.images.fallback.src;
    }
  };

  const metaTitle = () => {
    if (titleField && data[titleField]) {
      return data[titleField];
    }
    if (title) {
      return title;
    }
    if (field_title_context) {
      return field_title_context;
    }
    return null;
  };
  const metaDescription = () => {
    if (body && body.summary) {
      return body.summary;
    }
    return siteData.site.siteMetadata.description;
  };
  const metaKeywords = () => {
    if (!field_seo_keywords) {
      return null;
    }
    return (
      <meta name='keywords' content={field_seo_keywords} />
    );
  };
  const siteTitle = () => {
    if (!metaTitle() || metaTitle() === 'Home') {
      return defaultTitle;
    }
    return `${metaTitle()} | ${defaultTitle}`;
  };
  const pageUrl = () => {
    if (!fields.slug) {
      return null;
    }
    return fields.slug;
  };
  return (
    <>
      <title>{siteTitle()}</title>
      <meta property='og:title' content={metaTitle() && metaTitle() !== 'Home' ? metaTitle() : defaultTitle} />
      <meta property='og:image' content={siteData.site.siteMetadata.siteUrl + metaImage()} />
      <meta property='og:url' content={siteData.site.siteMetadata.siteUrl + pageUrl()} />
      <meta name='description' content={metaDescription()} />
      {metaKeywords()}
      <meta property='og:description' content={metaDescription()} />
      <meta property='og:type' content='website' />
      <meta property='twitter:description' content={metaDescription()} />
      <link rel='canonical' href={siteData.site.siteMetadata.siteUrl} />
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
