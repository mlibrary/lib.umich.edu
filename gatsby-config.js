const DRUPAL_URL = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu/';
const DRUPAL_CONCURRENT_FILE_REQUESTS = parseInt(process.env.DRUPAL_CONCURRENT_FILE_REQUESTS) || 20;
const DRUPAL_REQUEST_TIMEOUT = parseInt(process.env.DRUPAL_REQUEST_TIMEOUT) || 6000000;

console.log('[gatsby-config] ENV VARs');
console.log(`DRUPAL_URL='${DRUPAL_URL}'`);
console.log(`DRUPAL_CONCURRENT_FILE_REQUESTS=${DRUPAL_CONCURRENT_FILE_REQUESTS}`);
console.log(`DRUPAL_REQUEST_TIMEOUT=${DRUPAL_REQUEST_TIMEOUT}`);

const siteMetadata = {
  title: 'University of Michigan Library',
  siteUrl: 'https://www.lib.umich.edu'
};

module.exports = {
  flags: {
    DEV_SSR: false // Watches gatsby-ssr.js while developing
  },
  siteMetadata,
  plugins: [
    'gatsby-plugin-netlify', // Netlify recommends this plugin on top of Essential Gatsby (Version 2): https://github.com/netlify/netlify-plugin-gatsby#install-the-gatsby-plugin
    'gatsby-plugin-meta-redirect',
    'gatsby-plugin-remove-fingerprints', // Why? Read why Netlify recommends: https://github.com/gatsbyjs/gatsby/issues/11961#issuecomment-492893594
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images/`
      }
    },
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteMetadata.siteUrl,
        sitemap: siteMetadata.siteUrl + '/sitemap-index.xml',
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
            mode = 'development';
          }

          console.log(`[gatsby-plugin-robots-txt] is in ${mode} mode.`);

          return mode;
        },
        env: {
          production: {
            policy: [
              {
                userAgent: '*',
                allow: '/'
              }
            ]
          },
          development: {
            policy: [
              {
                userAgent: '*',
                disallow: ['/'],
                host: null,
                sitemap: null
              }
            ]
          }
        }
      }
    },
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        stripMetadata: true,
        defaultQuality: 75
      }
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-drupal',
      options: {
        baseUrl: DRUPAL_URL,
        apiBase: 'jsonapi',
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
      }
    },
    {
      resolve: 'gatsby-source-umich-lib',
      options: {
        baseUrl: DRUPAL_URL
      }
    },
    'gatsby-plugin-remove-serviceworker',
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'University of Michigan Library',
        short_name: 'U-M Library',
        start_url: '/',
        background_color: '#00274C',
        theme_color: '#FFCB05',
        display: 'minimal-ui',
        icon: 'src/images/icon.png' // This path is relative to the root of the site.
      }
    },
    {
      resolve: 'gatsby-plugin-lunr',
      options: {
        languages: [{ name: 'en' }],
        fields: [
          {
            name: 'title',
            store: true,
            attributes: { boost: 9 }
          },
          {
            name: 'summary',
            store: true,
            attributes: { boost: 3 }
          },
          {
            name: 'keywords',
            store: true
          },
          {
            name: 'uniqname',
            store: true
          }
        ],
        resolvers: {
          SitePage: {
            uniqname: (node) => {
              return (node.context ? node.context.uniqname : null);
            },
            title: (node) => {
              return (node.context ? node.context.title : null);
            },
            summary: (node) => {
              return (node.context ? node.context.summary : null);
            },
            keywords: (node) => {
              return (node.context ? node.context.keywords : null);
            }
          }
        }
      }
    }
  ],
  trailingSlash: 'never'
};
