import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

function SearchEngineOptimization({
  description,
  keywords,
  title,
}) {
  const data = useStaticQuery(graphql`
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
  const metaDescription = description || data.site.siteMetadata.description;
  return (
    <>
      <title>{title ? title + ' | ' : ''}{data.site.siteMetadata.title}</title>
      <meta name="description" content={metaDescription}/>
      <meta name="keywords" content={keywords ? keywords.join(', ') : []} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="twitter:description" content={metaDescription} />
      <link rel="canonical" href={data.site.siteMetadata.siteUrl} />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@umich-lib/css@1.0.9/dist/umich-lib.css" />
      <script async type="text/javascript" src="https://umich.edu/apis/umalerts/umalerts.js"></script>
    </>
  );
}

SearchEngineOptimization.propTypes = {
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

export default SearchEngineOptimization;
