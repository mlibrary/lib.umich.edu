import React from "react"
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import rehypeReact from "rehype-react"
import {
  Heading,
  Text,
  List,
  COLORS
} from '@umich-lib/core'
import unified from "unified"
import rehype from "rehype-parse"
import Prose from './prose'
import Link from './link'
/**
  Headings
*/
const Heading2 = ({ children, ...other }) => (
  <Heading level={2} size="M" {...other}>
    {children}
  </Heading>
);
const Heading3 = ({ children, ...other }) => (
  <Heading level={3} size="S" {...other}>
    {children}
  </Heading>
);
const Heading4 = ({ children, ...other }) => (
  <Heading
    level={4}
    size="3XS"
    style={{ color: COLORS.neutral["300"] }}
    {...other}
  >
    {children}
  </Heading>
);
const Heading5 = ({ children, ...other }) => (
  <Heading level={5} size="3XS" {...other}>
    {children}
  </Heading>
);
const Heading6 = ({ children, ...other }) => (
  <Heading level={6} size="3XS" {...other}>
    {children}
  </Heading>
);

const renderHast = new rehypeReact({
  components: {
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    h5: Heading5,
    h6: Heading6,
    a: ({children, ...other}) => ({ to, children }) => <Link to={to}>{children}</Link>,
    p: ({children}) => <Text>{children}</Text>,
    strong: ({children}) => <strong css={{ fontWeight: '800' }}>{children}</strong>,
    ul: ({ children }) => <List type="bulleted">{children}</List>,
    ol: ({ children }) => <List type="numbered">{children}</List>,
    'text': Text,
    'lede': ({ children, ...other }) => <Text lede {...other}>{children}</Text>,
    img: (props) => {
      /*
        Get all Drupal images so that we can later replace the generated
        html img tag with the Gatsby Image component.
      */
      const drupalImageNodes = useStaticQuery(
        graphql`
          query {
            allFileFile {
              edges {
                node {
                  filename
                  drupal_id
                  localFile {
                    childImageSharp {
                      fluid(maxWidth: 500) {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                }
              }
            }
          }
        `
      )

      /*
        Can we find a matching image? The html img has a data
        attribute of the Drupal entity uuid to match on.

        We expect to find it. If it's in the HTML then it
        must be an entity brought in by the source plugin.

        If it's not found, then something is probably wrong.
      */
      const matchedImage = drupalImageNodes.allFileFile.edges.filter(
        edge => edge.node.drupal_id === props['data-entity-uuid']
      )

      try {
        return <Img fluid={matchedImage[0].node.localFile.childImageSharp.fluid} alt={props.alt} />
      }
      catch(error) {
        console.warn(error, 'Unable to render image with Drupal entity uuid', props['data-entity-uuid'])
      }

      return null
    }
  },

  // A workaround to replace the container div created by rehype-react with a React fragment.
  createElement: (component, props = {}, children = []) => {
    if (component === 'div') {
      return <React.Fragment {...props}>{children}</React.Fragment>;
    }

    return React.createElement(component, props, children);
  }
}).Compiler

export default ({ html }) => {
  const tree = unified()
    .use(rehype, { fragment: true })
    .parse(html);

  return (
    <Prose>
      {renderHast(tree)}
    </Prose>
  )
}