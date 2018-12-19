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
        baseUrl: `https://dev.lib.umich.edu/web/`
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion'
  ],
}
