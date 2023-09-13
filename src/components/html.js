import React from 'react';
import rehypeReact from 'rehype-react';
import { Heading, Text, List, COLORS } from '../reusable';
import { unified } from 'unified';
import rehype from 'rehype-parse';
import Prose from './prose';
import Link from './link';
import DrupalEntity from './drupal-entity';
import Callout from '../reusable/callout';
import Blockquote from '../reusable/blockquote';
import Table from './table';
import PropTypes from 'prop-types';

/**
  Headings
*/
const Heading2 = ({ children, ...other }) => {
  return (
    <Heading level={2} size='M' {...other}>
      {children}
    </Heading>
  );
};

Heading2.propTypes = {
  children: PropTypes.object
};

const Heading3 = ({ children, ...other }) => {
  return (
    <Heading level={3} size='S' {...other}>
      {children}
    </Heading>
  );
};

Heading3.propTypes = {
  children: PropTypes.object
};

const Heading4 = ({ children, ...other }) => {
  return (
    <Heading
      level={4}
      size='3XS'
      style={{ color: COLORS.neutral['300'] }}
      {...other}
    >
      {children}
    </Heading>
  );
};

Heading4.propTypes = {
  children: PropTypes.object
};

const Heading5 = ({ children, ...other }) => {
  return (
    <Heading level={5} size='3XS' {...other}>
      {children}
    </Heading>
  );
};

Heading5.propTypes = {
  children: PropTypes.object
};

const Heading6 = ({ children, ...other }) => {
  return (
    <Heading level={6} size='3XS' {...other}>
      {children}
    </Heading>
  );
};

Heading6.propTypes = {
  children: PropTypes.object
};

const renderHast = () => {
  return new rehypeReact({ // eslint-disable-line
    components: {
      h2: Heading2,
      h3: Heading3,
      h4: Heading4,
      h5: Heading5,
      h6: Heading6,
      a: ({ children, href, ...other }) => {
        if (!children || !href) {
        // Don't render links without a label or href
          return null;
        }
        return <Link to={href}>{children}</Link>;
      },
      p: ({ children, className }) => {
        if (className === 'umich-lib-callout') {
          return <Callout>{children}</Callout>;
        }

        if (className === 'umich-lib-alert') {
          return (
            <Callout intent='warning' alert>
              {children}
            </Callout>
          );
        }

        return <Text>{children}</Text>;
      },
      strong: ({ children }) => {
        return (
          <strong css={{ fontWeight: '800' }}>{children}</strong>
        );
      },
      ul: ({ children }) => {
        return <List type='bulleted'>{children}</List>;
      },
      ol: ({ children }) => {
        return <List type='numbered'>{children}</List>;
      },
      br: () => {
        return <br />;
      },
      em: (props) => {
        return <em {...props} css={{ fontStyle: 'italic' }} />;
      },
      text: Text,
      lede: ({ children, ...other }) => {
        return (
          <Text lede {...other}>
            {children}
          </Text>
        );
      },
      u: ({ children }) => {
        return children;
      },
      blockquote: (props) => {
        return <Blockquote {...props} />;
      },
      'drupal-entity': (props) => {
        return <DrupalEntity {...props} />;
      },
      iframe: () => {
        return null;
      },
      article: () => {
        return null;
      },
      figure: (props) => {
        return <figure {...props} css={{ maxWidth: '38rem' }} />;
      },
      figcaption: (props) => {
        return (
          <figcaption
            {...props}
            css={{
              color: COLORS.neutral['300']
            }}
          />
        );
      },
      table: Table
    },

    // A workaround to replace the container div created by rehype-react with a React fragment.
    createElement: (component, props = {}, children = []) => {
      if (props['data-entity-uuid']) {
        return <DrupalEntity {...props} />;
      }

      if (component === 'div') {
        return <React.Fragment {...props}>{children}</React.Fragment>;
      }

      return React.createElement(component, props, children);
    }
  }).Compiler;
};

function Html ({ html, ...rest }) {
  const tree = unified().use(rehype, { fragment: true }).parse(html);

  return <Prose {...rest}>{renderHast(tree)}</Prose>;
}

Html.propTypes = {
  html: PropTypes.string
};

export default Html;
