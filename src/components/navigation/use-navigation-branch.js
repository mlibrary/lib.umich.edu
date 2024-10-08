import { graphql, useStaticQuery } from 'gatsby';

const getSiteMapBranch = ({ data, to }) => {
  const find = (toFind) => {
    return to.startsWith(toFind.to);
  };
  const root = data.find(find);

  if (root) {
    const parent = root.children.find(find);

    if (parent) {
      return parent;
    }
  }

  return null;
};

export default function useNavigationBranch (to, type) {
  const data = useStaticQuery(
    graphql`
      {
        allNavPrimary {
          edges {
            node {
              nav {
                to
                text
                children {
                  text
                  to
                  children {
                    text
                    to
                    children {
                      text
                      to
                    }
                  }
                }
              }
            }
          }
        }
        allNavUtility {
          edges {
            node {
              nav {
                to
                text
              }
            }
          }
        }
      }
    `
  );

  const branch = getSiteMapBranch({
    data: data.allNavPrimary.edges[0].node.nav,
    to
  });

  if (type === 'small') {
    if (branch && branch.children) {
      const next = branch.children.find((toFind) => {
        return to.includes(toFind.to);
      });

      return next;
    }

    return null;
  }

  return branch;
}
