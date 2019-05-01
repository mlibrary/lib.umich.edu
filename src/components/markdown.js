import React from "react"
import rehypeReact from "rehype-react"
import {
  Heading,
  Text,
  List
} from '@umich-lib/core'
import { Link } from 'gatsby'

/**
  Headings
*/
const Heading2 = ({ children, ...other }) => (
  <Heading level={2} size="large" {...other}>{children}</Heading>
)
const Heading3 = ({ children, ...other }) => (
  <Heading level={3} size="medium" {...other}>{children}</Heading>
)
const Heading4 = ({ children, ...other }) => (
  <Heading level={4} size="small" {...other}>{children}</Heading>
)
const Heading5 = ({ children, ...other }) => (
  <Heading level={5} size="xsmall" {...other}>{children}</Heading>
)
const Heading6 = ({ children, ...other }) => (
  <Heading level={6} size="xsmall" {...other}>{children}</Heading>
)

const renderAst = new rehypeReact({
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

export default ({ htmlAst }) => {
  return (
    <React.Fragment>
      {renderAst(htmlAst)}
    </React.Fragment>
  )
}