module.exports = {
  siteMetadata: {
    title: 'University of Michigan Library'
  },
  plugins: [
    {
      resolve: `gatsby-source-drupal`,
      options: {
        baseUrl: `http://ardbeg.umdl.umich.edu/web/`
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion',
    'gatsby-plugin-umich-lib-drupal'
  ],
}
