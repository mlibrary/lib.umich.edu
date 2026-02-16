import { graphql, useStaticQuery } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import squarelogo from '../images/squarelogo.png';
import { useLocation } from '@reach/router';

const SearchEngineOptimization = ({ data, children, titleField }) => {
  const siteData = useStaticQuery(graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
        description
      }
    }
  }
`);

  const defaultTitle = siteData.site.siteMetadata.title;
  const { title, field_title_context: fieldTitleContext, body, field_seo_keywords: fieldSeoKeywords } = data || {};

  const location = useLocation();

  const metaTitle = () => {
    if (titleField && data[titleField]) {
      return data[titleField];
    }
    if (title) {
      return title;
    }
    if (fieldTitleContext) {
      return fieldTitleContext;
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
    if (!fieldSeoKeywords) {
      return null;
    }
    return (
      <meta name='keywords' content={fieldSeoKeywords} />
    );
  };
  const metaImage = () => {
    const imagesrc = data?.relationships?.field_media_image?.relationships?.field_media_image?.localFile?.childImageSharp?.gatsbyImageData?.images?.fallback?.src;

    if (imagesrc) {
      return (<meta property='og:image' content={siteData.site.siteMetadata.siteUrl + imagesrc} />);
    }
    if (squarelogo) {
      return (<meta property='og:image' content={squarelogo} />);
    }
    return null;
  };
  const siteTitle = () => {
    if (!metaTitle() || metaTitle() === 'Home') {
      return defaultTitle;
    }
    return `${metaTitle()} | ${defaultTitle}`;
  };

  const pageUrl = () => {
    return (siteData.site.siteMetadata.siteUrl + location?.pathname);
  };

  return (
    <>
      <title>{siteTitle()}</title>
      <meta property='og:title' content={metaTitle() && metaTitle() !== 'Home' ? metaTitle() : defaultTitle} />
      <meta property='og:url' content={pageUrl()} />
      <meta name='description' content={metaDescription()} />
      {metaImage()}
      {metaKeywords()}
      <meta property='og:description' content={metaDescription()} />
      <meta property='og:type' content='website' />
      <meta property='twitter:description' content={metaDescription()} />
      <link rel='canonical' href={pageUrl()} />
      {children}
    </>
  );
};

SearchEngineOptimization.propTypes = {
  children: PropTypes.object,
  data: PropTypes.object,
  titleField: PropTypes.string
};

export default SearchEngineOptimization;
