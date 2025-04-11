/* eslint-disable id-length */
import * as prod from 'react/jsx-runtime';
import { Heading, List, Text } from '../reusable';
import React, { createElement, Fragment, useEffect, useState } from 'react';
import Blockquote from '../reusable/blockquote';
import Callout from '../reusable/callout';
import CallToAction from '../reusable/call-to-action';
import DrupalEntity from './drupal-entity';
import Link from './link';
import PropTypes from 'prop-types';
import Prose from './prose';
import rehypeDrupalEntity from '../utils/rehype-drupal-entity';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import Table from './table';
import { unified } from 'unified';

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
  children: PropTypes.any
};

const Heading3 = ({ children, ...other }) => {
  return (
    <Heading level={3} size='S' {...other}>
      {children}
    </Heading>
  );
};

Heading3.propTypes = {
  children: PropTypes.any
};
const Heading4 = ({ children, ...other }) => {
  return (
    <Heading
      level={4}
      size='3XS'
      style={{ color: 'var(--color-neutral-300)' }}
      {...other}
    >
      {children}
    </Heading>
  );
};

Heading4.propTypes = {
  children: PropTypes.any
};
const Heading5 = ({ children, ...other }) => {
  return (
    <Heading level={5} size='3XS' {...other}>
      {children}
    </Heading>
  );
};

Heading5.propTypes = {
  children: PropTypes.any
};
const Heading6 = ({ children, ...other }) => {
  return (
    <Heading level={6} size='3XS' {...other}>
      {children}
    </Heading>
  );
};

Heading6.propTypes = {
  children: PropTypes.any
};

const components = {
  a: ({ children, href }) => {
    if (!children || !href) {
      return null;
    }
    return <Link to={href}>{children}</Link>;
  },
  article: () => {
    return null;
  },
  blockquote: (props) => {
    return <Blockquote {...props} />;
  },
  br: () => {
    return <br />;
  },
  'drupal-entity': (props) => {
    return <DrupalEntity {...props} />;
  },
  em: (props) => {
    return <em {...props} css={{ fontStyle: 'italic' }} />;
  },
  figcaption: (props) => {
    return (
      <figcaption
        {...props}
        css={{
          color: 'var(--color-neutral-300)'
        }}
      />
    );
  },
  figure: (props) => {
    return <figure {...props} css={{ maxWidth: '38rem' }} />;
  },
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  iframe: () => {
    return null;
  },
  img: (props) => {
    return <img {...props} />;
  },
  lede: ({ children, ...other }) => {
    return (
      <Text lede {...other}>
        {children}
      </Text>
    );
  },
  ol: ({ children }) => {
    return <List type='numbered'>{children}</List>;
  },
  p: ({ children, className }) => {
    if (className === 'umich-lib-callout') {
      return <Callout>{children}</Callout>;
    }
    if (className === 'umich-lib-alert') {
      return (
        <Callout intent='warning' alert={true}>
          {children}
        </Callout>
      );
    }
    if (className === 'umich-lib-cta') {
      return <CallToAction>{children}</CallToAction>;
    }
    return <Text>{children}</Text>;
  },
  strong: ({ children }) => {
    return (
      <strong css={{ fontWeight: '800' }}>{children}</strong>
    );
  },
  table: Table,
  text: Text,
  u: ({ children }) => {
    return children;
  },
  ul: ({ children }) => {
    return <List type='bulleted'>{children}</List>;
  }
};

const processor = (text) => {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeDrupalEntity)
    .use(rehypeReact, {
      Fragment: prod.Fragment,
      components,
      createElement: (component, props = {}, children = []) => {
        if (props['data-entity-uuid']) {
          return <DrupalEntity {...props} />;
        }

        if (component === 'div') {
          return <Fragment {...props}>{children}</Fragment>;
        }

        return createElement(component, props, children);
      },
      jsx: prod.jsx,
      jsxs: prod.jsxs
    })
    .process(text);
};

export default function Html ({ html, ...rest }) {
  const [content, setContent] = useState(<></>);

  useEffect(() => {
    (async () => {
      const file = await processor(html);
      setContent(file.result);
    })();
  }, [html]);
  return <Prose {...rest}>{content}</Prose>;
}

Html.propTypes = {
  html: PropTypes.any
};
