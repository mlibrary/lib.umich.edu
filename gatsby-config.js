module.exports = {
  siteMetadata: {
    title: 'University of Michigan Library'
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-drupal`,
      options: {
        baseUrl: process.env.DRUPAL_BASE_URL
      },
    },
    'gatsby-source-umich-lib',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion'
  ],
}
