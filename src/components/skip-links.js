import { COLORS, Margins, SPACING } from '../reusable';
import { Link as GatsbyLink } from 'gatsby';
import React from 'react';

export default function SkipLinks () {
  return (
    <section
      aria-label='Skip links'
      css={{
        '*:focus': {
          outlineColor: 'white'
        },
        ':focus-within': {
          // eslint-disable-next-line id-length
          a: {
            color: 'white',
            padding: SPACING.XS,
            textDecoration: 'underline'
          },
          height: 'auto',
          li: {
            textAlign: 'center'
          },
          padding: `${SPACING.M} 0`,
          position: 'static',
          'ul > li:not(:last-of-type)': {
            marginBottom: SPACING.M
          },
          width: 'auto'
        },
        background: COLORS.blue['400'],
        height: '1px',
        left: '-10000px',
        overflow: 'hidden',
        position: 'absolute',
        top: 'auto',
        width: '1px'
      }}
    >
      <Margins>
        <ul>
          <li>
            <a href='#maincontent'>Skip to main content</a>
          </li>
          <li>
            <a href='#chat'>Skip to Ask a Librarian chat</a>
          </li>
          <li>
            <GatsbyLink to='/site-map'>View site map</GatsbyLink>
          </li>
        </ul>
      </Margins>
    </section>
  );
}
