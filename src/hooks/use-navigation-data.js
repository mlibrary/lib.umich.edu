import { useStaticQuery, graphql } from "gatsby"

const useNavigationData = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allNavPrimary {
          edges {
            node {
              nav {
                to
                text
                children {
                  text
                  to
                  description
                  children {
                    text
                    to
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
  )

  return {
    primary: data.allNavPrimary.edges[0].node.nav,
    secondary: data.allNavUtility.edges[0].node.nav
  }
}

export default useNavigationData