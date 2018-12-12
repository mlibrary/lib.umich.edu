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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `@weknow/gatsby-remark-drupal`,
            options: {
              nodes: [`page`, `landing_page`, `article`]
            }
          }
        ]
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion'
  ],
}
