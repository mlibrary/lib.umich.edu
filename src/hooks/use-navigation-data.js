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
        }
        allNavUtility {
          edges {
            node {
              nav {
                text
                icon
                to
                children {
                  to
                  text
                  children {
                    text
                    to
                    children {
                      to
                      text
                    }
                  }
                }
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
