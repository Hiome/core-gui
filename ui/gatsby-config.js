module.exports = {
  siteMetadata: {
    title: `Hiome`,
    description: `Your home's personal dashboard.`,
    author: `Hiome Inc`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-antd',
      options: {
        style: true
      }
    },
    {
      resolve: "gatsby-plugin-less",
      options: {
        javascriptEnabled: true,
        modifyVars: {
          "primary-color": "#6F3CD1"
        }
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Hiome`,
        short_name: `Hiome`,
        start_url: `/`,
        background_color: `#6F3CD1`,
        theme_color: `#6F3CD1`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    }
  ],
}
