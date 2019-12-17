const COLORS = require('@umich-lib/core').COLORS

let activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development'
console.log(`Using environment config: '${activeEnv}'`)
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

const DRUPAL_URL = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu/'
console.log(`Using DRUPAL_URL: '${DRUPAL_URL}'`)

module.exports = {
  siteMetadata: {
    title: 'University of Michigan Library',
    siteUrl: 'https://preview.lib.umich.edu/',
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
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', disallow: '/' }],
        sitemap: null,
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
    {
      resolve: 'gatsby-source-drupal',
      options: {
        baseUrl: DRUPAL_URL,
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
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        fields: ['title', 'slug', 'summary'],
        resolvers: {
          SitePage: {
            title: node => (node.context ? node.context.title : null),
            slug: node => (node.context ? node.context.slug : null),
            summary: node => (node.context ? node.context.summary : null),
          },
        },
      },
    },
  ],
}
