import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

function SearchEngineOptimization({
  description,
  lang,
  meta,
  keywords,
  title,
}) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  const metaDescription = description || data.site.siteMetadata.description;
  return (
    <Helmet
      htmlAttributes={{lang}}
      defaultTitle={data.site.siteMetadata.title}
      title={title}
      titleTemplate={`%s | ${data.site.siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
      ]
        .concat(
          keywords
            ? {
                name: 'keywords',
                content: keywords,
              }
            : []
        )
        .concat(meta)}
    >
      <link
        href="https://cdn.jsdelivr.net/npm/@umich-lib/css@1.0.9/dist/umich-lib.css"
        rel="stylesheet"
      />
      <script
        async
        type="text/javascript"
        src="https://umich.edu/apis/umalerts/umalerts.js"
      ></script>
    </Helmet>
  );
}

SearchEngineOptimization.defaultProps = {
  lang: 'en',
  meta: [],
  keywords: [],
};

SearchEngineOptimization.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

export default SearchEngineOptimization;
