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
      const { title, drupal_nid: drupalNid, slug, tag } = pageContext;
      if (drupalNid) {
        return {
          ...memo,
          [drupalNid]: {
            // eslint-disable-next-line camelcase
            drupal_nid: drupalNid,
            slug,
            tag,
            title
          }
        };
      }
    }

    return memo;
  }, {});
}
