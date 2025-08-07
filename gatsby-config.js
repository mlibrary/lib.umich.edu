const DRUPAL_URL = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu/';
const DRUPAL_CONCURRENT_FILE_REQUESTS = parseInt(process.env.DRUPAL_CONCURRENT_FILE_REQUESTS) || 20;
const DRUPAL_REQUEST_TIMEOUT = parseInt(process.env.DRUPAL_REQUEST_TIMEOUT) || 6000000;

const adapter = require('gatsby-adapter-netlify').default;

console.log('[gatsby-config] ENV VARs');
console.log(`DRUPAL_URL='${DRUPAL_URL}'`);
console.log(`DRUPAL_CONCURRENT_FILE_REQUESTS=${DRUPAL_CONCURRENT_FILE_REQUESTS}`);
console.log(`DRUPAL_REQUEST_TIMEOUT=${DRUPAL_REQUEST_TIMEOUT}`);

const siteMetadata = {
  siteUrl: 'https://www.lib.umich.edu',
  title: 'University of Michigan Library'
};

module.exports = {
  adapter: adapter({
    excludeDatastoreFromEngineFunction: false
  }),
  flags: {
    DEV_SSR: false // Watches gatsby-ssr.js while developing
  },
  plugins: [
    'gatsby-plugin-remove-fingerprints', // Why? Read why Netlify recommends: https://github.com/gatsbyjs/gatsby/issues/11961#issuecomment-492893594
    {
      options: {
        name: 'images',
        path: `${__dirname}/src/images/`
      },
      resolve: 'gatsby-source-filesystem'
    },
    'gatsby-plugin-sitemap',
    {
      options: {
        env: {
          development: {
            policy: [
              {
                disallow: ['/'],
                host: null,
                sitemap: null,
                userAgent: '*'
              }
            ]
          },
          production: {
            policy: [
              {
                allow: '/',
                userAgent: '*'
              }
            ]
          }
        },
        host: siteMetadata.siteUrl,
        resolveEnv: () => {
          /**
           *
           * Assume development env for robots.txt unless explicity
           * set to production with ROBOTSTXT_MODE env var.
           */
          let mode = 'development';

          /**
           * Only is the mode in production when Netlify is deploying from
           * the sites production branch and ROBOTSTXT_MODE is set to production.
           */
          if (process.env.ROBOTSTXT_MODE === 'production') {
            mode = 'production';
          }

          console.log(`[gatsby-plugin-robots-txt] is in ${mode} mode.`);

          return mode;
        },
        sitemap: `${siteMetadata.siteUrl}/sitemap-index.xml`
      },
      resolve: 'gatsby-plugin-robots-txt'
    },
    'gatsby-plugin-image',
    {
      options: {
        defaultQuality: 75,
        stripMetadata: true
      },
      resolve: 'gatsby-plugin-sharp'
    },
    'gatsby-transformer-sharp',
    {
      options: {
        apiBase: 'jsonapi',
        baseUrl: DRUPAL_URL,
        concurrentFileRequests: DRUPAL_CONCURRENT_FILE_REQUESTS,
        filters: {
          /*
            Filter out temporary files. This will help to avoid Gatsby
            throwing an error when a 404 is returned from a file
            that does not exist.
          */
          'file--file': 'filter[status][value]=1'
        },
        requestTimeoutMS: DRUPAL_REQUEST_TIMEOUT
      },
      resolve: 'gatsby-source-drupal'
    },
    {
      options: {
        baseUrl: DRUPAL_URL
      },
      resolve: 'gatsby-source-umich-lib'
    },
    'gatsby-plugin-emotion',
    {
      options: {
        background_color: '#00274C',
        display: 'minimal-ui',
        icon: 'src/images/icon.png', // This path is relative to the root of the site.
        name: 'University of Michigan Library',
        short_name: 'U-M Library',
        start_url: '/',
        theme_color: '#FFCB05'
      },
      resolve: 'gatsby-plugin-manifest'
    },
    {
      options: {
        fields: [
          {
            attributes: { boost: 9 },
            name: 'title',
            store: true
          },
          {
            attributes: { boost: 3 },
            name: 'summary',
            store: true
          },
          {
            name: 'keywords',
            store: true
          },
          {
            name: 'tag',
            store: true
          },
          {
            name: 'uniqname',
            store: true
          }
        ],
        languages: [{ name: 'en' }],
        resolvers: {
          SitePage: {
            keywords: (node) => {
              return (node.context ? node.context.keywords : null);
            },
            summary: (node) => {
              return (node.context ? node.context.summary : null);
            },
            tag: (node) => {
              return (node.context ? node.context.tag : null);
            },
            title: (node) => {
              return (node.context ? node.context.title : null);
            },
            uniqname: (node) => {
              return (node.context ? node.context.uniqname : null);
            }
          }
        }
      },
      resolve: 'gatsby-plugin-lunr'
    }
  ],
  siteMetadata,
  trailingSlash: 'never'
};
