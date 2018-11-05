const path = require(`path`)

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
        baseUrl: `http://ardbeg.umdl.umich.edu/web/`
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion'
  ],
}
