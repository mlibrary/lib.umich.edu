import { graphql, useStaticQuery } from 'gatsby';

export default function usePageContextByDrupalNodeID () {
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
      const { title, drupal_nid, slug } = pageContext;

      if (drupal_nid) {
        memo = {
          ...memo,
          [drupal_nid]: {
            title,
            drupal_nid,
            slug
          }
        };
      }
    }

    return memo;
  }, {});
}
