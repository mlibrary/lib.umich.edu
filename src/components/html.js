import * as prod from 'react/jsx-runtime';
import { createElement, Fragment, React, useEffect, useState } from 'react';
import { Heading, List, Text } from '../reusable';
import Blockquote from '../reusable/blockquote';
import Callout from '../reusable/callout';
import DrupalEntity from './drupal-entity';
import Link from './link';
import Prose from './prose';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import Table from './table';
import { unified } from 'unified';

const Heading2 = ({ children, ...other }) => {
  return (
    <Heading level={2} size='M' {...other}>
      {children}
    </Heading>
  );
};

const Heading3 = ({ children, ...other }) => {
  return (
    <Heading level={3} size='S' {...other}>
      {children}
    </Heading>
  );
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

const Heading5 = ({ children, ...other }) => {
  return (
    <Heading level={5} size='3XS' {...other}>
      {children}
    </Heading>
  );
};

const Heading6 = ({ children, ...other }) => {
  return (
    <Heading level={6} size='3XS' {...other}>
      {children}
    </Heading>
  );
};

/* eslint-disable id-length */
// eslint-disable-next-line sort-keys
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs, components: {
  a: ({ children, href }) => {
    if (!children || !href) {
      // Don't render links without a label or href
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
} };
/* eslint-enable id-length */

/**
 * @param {string} text
 * @returns {JSX.Element}
 */
const useProcessor = (text) => {
  const [Content, setContent] = useState(createElement(Fragment));

  useEffect(
    () => {
      ;(async function () {
        const file = await unified()
          .use(rehypeParse, { fragment: true })
          .use(rehypeReact, production)
          .process(text);

        setContent(file.result);
      })();
    },
    [text]
  );

  return Content;
};

const Html = ({ html, ...rest }) => {
  return <Prose {...rest}>{useProcessor(html)}</Prose>;
};

export default Html;
