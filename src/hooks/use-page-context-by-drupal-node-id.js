import { useStaticQuery, graphql } from 'gatsby'

export default function usePageContextByDrupalNodeID() {
  const data = useStaticQuery(
    graphql`
      query {
        allSitePage {
          edges {
            node {
              context {
                title
                drupal_nid
                slug
              }
            }
          }
        }
      }
    `
  )

  return data.allSitePage.edges.reduce((memo, edge) => {
    const { context } = edge.node
    memo = {
      ...memo,
      [context.drupal_nid]: context,
    }

    return memo
  }, {})
}
