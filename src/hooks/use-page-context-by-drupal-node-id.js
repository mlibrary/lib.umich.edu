import { useStaticQuery, graphql } from 'gatsby';

export default function usePageContextByDrupalNodeID() {
  const data = useStaticQuery(
    graphql`
      query {
        allSitePage {
          edges {
            node {
              pageContext
            }
          }
        }
      }
    `
  );

  return data.allSitePage.edges.reduce((memo, edge) => {
    const { pageContext } = edge.node;

    if (pageContext) {
      const { drupal_nid } = pageContext;

      if (drupal_nid) {
        memo = {
          ...memo,
          [drupal_nid]: pageContext,
        };
      }
    }

    return memo;
  }, {});
}
