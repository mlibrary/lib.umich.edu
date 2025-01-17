/* eslint-disable id-length */
import { Heading, SPACING } from '../reusable';
import IconText from './icon-text';
import PlainLink from './plain-link';
import PropTypes from 'prop-types';
import React from 'react';

const qs = require('qs');

export default function Share ({ url, title }) {
  const emailProps = qs.stringify({
    body: `University of Michigan Library: ${url}`,
    subject: title
  });

  const twitterProps = qs.stringify({
    text: `${title} @UMichLibrary`,
    url
  });

  const fbProps = qs.stringify({
    t: title,
    u: url
  });

  const options = [
    {
      icon: 'facebook',
      text: 'Facebook',
      to: `http://www.facebook.com/sharer/sharer.php?${fbProps}`
    },
    {
      icon: 'twitter',
      text: 'X (formerly Twitter)',
      to: `https://twitter.com/share?${twitterProps}`
    },
    {
      icon: 'email',
      text: 'Email',
      to: `mailto:?${emailProps}`
    }
  ];

  return (
    <>
      <Heading
        level={2}
        size='2XS'
        css={{
          fontWeight: '600'
        }}
      >
        Share
      </Heading>
      <ul>
        {options.map(({ text, to, icon, d }, y) => {
          return (
            <li key={y + to + text}>
              <PlainLink
                to={to}
                css={{
                  ':hover': {
                    textDecoration: 'underline'
                  },
                  display: 'inline-block',
                  padding: `${SPACING.XS} 0`,
                  svg: {
                    color: 'var(--color-neutral-300)'
                  }
                }}
              >
                <IconText icon={icon} d={d}>
                  {text}
                </IconText>
              </PlainLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}

Share.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string
};
