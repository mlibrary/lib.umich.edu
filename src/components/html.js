import React from "react"
import rehypeReact from "rehype-react"
import {
  Heading,
  Text,
  List
} from '@umich-lib/core'
import { Link } from 'gatsby'
import unified from "unified"
import rehype from "rehype-parse"

/**
  Headings
*/
const Heading2 = ({ children, ...other }) => (
  <Heading level={2} size="XL" {...other}>{children}</Heading>
)
const Heading3 = ({ children, ...other }) => (
  <Heading level={3} size="M" {...other}>{children}</Heading>
)
const Heading4 = ({ children, ...other }) => (
  <Heading level={4} size="S" {...other}>{children}</Heading>
)
const Heading5 = ({ children, ...other }) => (
  <Heading level={5} size="3XS" {...other}>{children}</Heading>
)
const Heading6 = ({ children, ...other }) => (
  <Heading level={6} size="3XS" {...other}>{children}</Heading>
)

const renderHast = new rehypeReact({
  components: {
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    h5: Heading5,
    h6: Heading6,
    a: ({children, ...other}) => ({ to, children }) => <Link to={to}>{children}</Link>,
    p: ({children}) => <Text>{children}</Text>,
    strong: ({children}) => <strong style={{ fontWeight: '600' }}>{children}</strong>,
    ul: ({ children }) => <List type="bulleted">{children}</List>,
    ol: ({ children }) => <List type="numbered">{children}</List>,
    'text': Text,
    'lede': ({ children, ...other }) => <Text lede {...other}>{children}</Text>
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
    <React.Fragment>
      {renderHast(tree)}
    </React.Fragment>
  )
}