import React from 'react'
import rehypeReact from 'rehype-react'
import {
  Heading,
  Text,
  List,
  COLORS,
  Alert,
  Icon,
  SPACING,
} from '@umich-lib/core'
import unified from 'unified'
import rehype from 'rehype-parse'
import Prose from './prose'
import Link from './link'
import DrupalEntity from './drupal-entity'
import Callout from '../maybe-design-system/callout'
import Blockquote from '../maybe-design-system/blockquote'

/**
  Headings
*/
const Heading2 = ({ children, ...other }) => (
  <Heading level={2} size="M" {...other}>
    {children}
  </Heading>
)
const Heading3 = ({ children, ...other }) => (
  <Heading level={3} size="S" {...other}>
    {children}
  </Heading>
)
const Heading4 = ({ children, ...other }) => (
  <Heading
    level={4}
    size="3XS"
    style={{ color: COLORS.neutral['300'] }}
    {...other}
  >
    {children}
  </Heading>
)
const Heading5 = ({ children, ...other }) => (
  <Heading level={5} size="3XS" {...other}>
    {children}
  </Heading>
)
const Heading6 = ({ children, ...other }) => (
  <Heading level={6} size="3XS" {...other}>
    {children}
  </Heading>
)

const renderHast = new rehypeReact({
  components: {
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    h5: Heading5,
    h6: Heading6,
    a: ({ children, href, ...other }) => {
      if (!children || !href) {
        // Don't render links without a label or href
        return null
      }
      return <Link to={href}>{children}</Link>
    },
    p: ({ children, className }) => {
      if (className === 'umich-lib-callout') {
        return <Callout>{children}</Callout>
      }

      if (className === 'umich-lib-alert') {
        return (
          <div
            css={{
              maxWidth: '38rem',
            }}
          >
            <Alert intent="warning">
              <div
                css={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gridGap: SPACING['XS'],
                  padding: `${SPACING['XS']} 0`,
                }}
              >
                <Icon
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                  size={24}
                  css={{
                    margin: SPACING['XS'],
                    color: COLORS.maize['500'],
                  }}
                />
                <div>{children}</div>
              </div>
            </Alert>
          </div>
        )
      }

      return <Text>{children}</Text>
    },
    strong: ({ children }) => (
      <strong css={{ fontWeight: '800' }}>{children}</strong>
    ),
    ul: ({ children }) => <List type="bulleted">{children}</List>,
    ol: ({ children }) => <List type="numbered">{children}</List>,
    br: () => null,
    em: props => <em {...props} css={{ fontStyle: 'italic' }} />,
    text: Text,
    lede: ({ children, ...other }) => (
      <Text lede {...other}>
        {children}
      </Text>
    ),
    u: ({ children }) => children,
    blockquote: props => <Blockquote {...props} />,
    'drupal-entity': props => <DrupalEntity {...props} />,
    iframe: () => null,
    article: () => null,
    figure: props => <figure {...props} css={{ maxWidth: '38rem' }} />,
    figcaption: props => (
      <figcaption
        {...props}
        css={{
          color: COLORS.neutral['300'],
        }}
      />
    ),
  },

  // A workaround to replace the container div created by rehype-react with a React fragment.
  createElement: (component, props = {}, children = []) => {
    if (props['data-entity-uuid']) {
      return <DrupalEntity {...props} />
    }

    if (component === 'div') {
      return <React.Fragment {...props}>{children}</React.Fragment>
    }

    return React.createElement(component, props, children)
  },
}).Compiler

export default ({ html }) => {
  const tree = unified()
    .use(rehype, { fragment: true })
    .parse(html)

  return <Prose>{renderHast(tree)}</Prose>
}
