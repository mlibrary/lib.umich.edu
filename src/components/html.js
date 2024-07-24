import * as prod from 'react/jsx-runtime';
import { COLORS, Heading, List, Text } from '../reusable';
import { createElement, Fragment, React, useEffect, useState } from 'react';
import Blockquote from '../reusable/blockquote';
import Callout from '../reusable/callout';
import DrupalEntity from './drupal-entity';
import Link from './link';
import PropTypes from 'prop-types';
import Prose from './prose';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import Table from './table';
import { unified } from 'unified';

/**
 *Headings
 */
const Heading2 = ({ children, ...other }) => {
  return (
    <Heading level={2} size='M' {...other}>
      {children}
    </Heading>
  );
};

Heading2.propTypes = {
  children: PropTypes.node
};

const Heading3 = ({ children, ...other }) => {
  return (
    <Heading level={3} size='S' {...other}>
      {children}
    </Heading>
  );
};

Heading3.propTypes = {
  children: PropTypes.node
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
  children: PropTypes.node
};

const Heading5 = ({ children, ...other }) => {
  return (
    <Heading level={5} size='3XS' {...other}>
      {children}
    </Heading>
  );
};

Heading5.propTypes = {
  children: PropTypes.node
};

const Heading6 = ({ children, ...other }) => {
  return (
    <Heading level={6} size='3XS' {...other}>
      {children}
    </Heading>
  );
};

Heading6.propTypes = {
  children: PropTypes.node
};

// Components setup
/* eslint-disable sort-keys */
/* eslint-disable id-length */
const components = {
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  a: ({ children, href }) => {
    if (!children || !href) {
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
        <Callout intent='warning' alert={true}>
          {children}
        </Callout>
      );
    }
    return <Text>{children}</Text>;
  },
  strong: ({ children }) => {
    return (
      <strong style={{ fontWeight: '800' }}>{children}</strong>
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
    return <em {...props} style={{ fontStyle: 'italic' }} />;
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
    return <figure {...props} style={{ maxWidth: '38rem' }} />;
  },
  figcaption: (props) => {
    return (
      <figcaption
        {...props}
        style={{
          // Replace COLORS.neutral['300'] with the actual color value
          color: 'neutral.300'
        }}
      />
    );
  },
  table: Table
};

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs, components };

/**
 * @param {string} text
 * @returns {JSX.Element}
 */
const useProcessor = (text) => {
  const [Content, setContent] = useState(null);

  useEffect(
    () => {
      ;(async function AsyncUnify () {
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
  const tree = useProcessor(html);
  return <Prose {...rest}>{tree}</Prose>;
};

Html.propTypes = {
  html: PropTypes.string
};

export default Html;
