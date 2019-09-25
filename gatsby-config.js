const COLORS = require('@umich-lib/core').COLORS
const defaultDrupalBaseUrl = 'https://cms.dev.lib.umich.edu/'

module.exports = {
  siteMetadata: {
    title: 'University of Michigan Library',
    siteUrl: 'https://preview.lib.umich.edu/',
  },
  plugins: [
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', disallow: '/' }],
        sitemap: null,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-background-image-es5',
    {
      resolve: 'gatsby-source-drupal',
      options: {
        baseUrl: process.env.DRUPAL_BASE_URL || defaultDrupalBaseUrl,
        preview: true,
      },
    },
    {
      resolve: 'gatsby-source-umich-lib',
      options: {
        baseUrl: process.env.DRUPAL_BASE_URL || defaultDrupalBaseUrl,
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
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        fields: ['title', 'slug'],
        resolvers: {
          SitePage: {
            title: node => node.context.title,
            slug: node => node.context.slug
          },
        },
        filter: (node) => node.context !== undefined
      },
    },
  ],
}
