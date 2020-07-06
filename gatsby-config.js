const COLORS = require('@umich-lib/core').COLORS
const DRUPAL_URL = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu/'
console.log(`Using DRUPAL_URL: '${DRUPAL_URL}'`)

module.exports = {
  siteMetadata: {
    title: 'University of Michigan Library',
    siteUrl: 'https://lib.umich.edu',
  },
  plugins: [
    `gatsby-plugin-remove-trailing-slashes`,
    'gatsby-plugin-netlify',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteMetadata.siteUrl,
        sitemap: siteMetadata.siteUrl + '/sitemap.xml',
        resolveEnv: () => {
          /*
            Assume development env for robots.txt unless explicity set to production.
          */
          const NETLIFY_CONTEXT = process.env.CONTEXT // More: https://docs.netlify.com/site-deploys/overview/#deploy-contexts
          const isProduction =
            process.env.GATSBY_ENV === 'production' ||
            NETLIFY_CONTEXT === 'production'
          const ROBOTS_ENV = isProduction ? 'production' : 'development'
          console.log(`[gatsby-plugin-robots-txt] env: "${ROBOTS_ENV}"`)

          return ROBOTS_ENV
        },
        env: {
          production: {
            policy: [{ userAgent: '*' }],
          },
          development: {
            policy: [{ userAgent: '*', disallow: '/' }],
          },
        },
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        stripMetadata: true,
        defaultQuality: 75,
      },
    },
    /*
    {
      resolve: 'gatsby-source-libguides',
      options: {
        api: {
          url: process.env.LIBGUIDES_API_URL,
        },
        client: {
          url: process.env.LIBGUIDES_CLIENT_URL,
          id: process.env.LIBGUIDES_CLIENT_ID,
          secret: process.env.LIBGUIDES_CLIENT_SECRET,
        },
      },
    },
    */
    {
      resolve: 'gatsby-source-drupal',
      options: {
        baseUrl: DRUPAL_URL,
        apiBase: `jsonapi`,
        filters: {
          page: 'filter[field_redirect_node]=0',
        },
      },
    },
    {
      resolve: 'gatsby-source-umich-lib',
      options: {
        baseUrl: DRUPAL_URL,
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'University of Michigan Library',
        short_name: 'U-M Library',
        start_url: '/',
        background_color: COLORS.blue['400'],
        theme_color: COLORS.maize['400'],
        display: 'minimal-ui',
        icon: 'src/images/icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-lunr`,
      options: {
        languages: [{ name: 'en' }],
        fields: [
          {
            name: 'title',
            store: true,
            attributes: { boost: 9 },
          },
          {
            name: 'summary',
            store: true,
            attributes: { boost: 3 },
          },
          {
            name: 'keywords',
            store: true,
          },
        ],
        resolvers: {
          SitePage: {
            title: node => (node.context ? node.context.title : null),
            summary: node => (node.context ? node.context.summary : null),
            keywords: node => (node.context ? node.context.keywords : null),
          },
        },
      },
    },
    `gatsby-plugin-client-side-redirect`,
  ],
}
