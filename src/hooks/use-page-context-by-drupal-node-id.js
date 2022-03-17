import { useStaticQuery, graphql } from 'gatsby';

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
  );

  return data.allSitePage.edges.reduce((memo, edge) => {
    const { context } = edge.node;

    if (context) {
      const { drupal_nid } = context;

      if (drupal_nid) {
        memo = {
          ...memo,
          [drupal_nid]: context,
        };
      }
    }

    return memo;
  }, {});
}
