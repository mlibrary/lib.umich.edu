import {
  COLORS,
  LargeScreen,
  Margins,
  MEDIA_QUERIES,
  SmallScreen,
  SPACING
} from '../../reusable';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

export default function HorizontalNavigation ({ items, ...rest }) {
  if (!items) {
    return null;
  }

  return (
    <nav
      css={{
        background: 'var(--colors-blue-100)',
        borderBottom: `solid 1px var(--colors-neutral-100)`,
        marginBottom: SPACING.XL,
        zIndex: '1'
      }}
      {...rest}
      aria-label='Local'
    >
      <Margins
        css={{
          padding: '0',
          [MEDIA_QUERIES.LARGESCREEN]: {
            padding: `0 ${SPACING['2XL']}`
          }
        }}
      >
        <ol>
          {items.map(({ to, text }, iterator) => {
            return (
              <li
                key={iterator + to}
                css={{
                  borderTop: `solid 1px var(--colors-neutral-100)`,
                  [MEDIA_QUERIES.LARGESCREEN]: {
                    border: 'none',
                    display: 'inline-block',
                    marginRight: SPACING.L
                  }
                }}
              >
                <LargeScreen>
                  <Link
                    css={{
                      display: 'inline-block',
                      paddingBottom: `calc(${SPACING.L} - 4px)`,
                      paddingTop: SPACING.L
                    }}
                    activeStyle={{
                      borderBottom: `solid 4px var(--colors-teal-400)`,
                      fontWeight: '700'
                    }}
                    to={to}
                  >
                    {text}
                  </Link>
                </LargeScreen>
                <SmallScreen>
                  <Link
                    css={{
                      display: 'block',
                      paddingBottom: SPACING.M,
                      paddingLeft: `calc(${SPACING.M} - 4px)`,
                      paddingTop: SPACING.M
                    }}
                    activeStyle={{
                      background: 'var(--colors-teal-100)',
                      borderLeft: `solid 4px var(--colors-teal-400)`,
                      color: 'var(--colors-teal-400)',
                      fontWeight: '700'
                    }}
                    to={to}
                  >
                    {text}
                  </Link>
                </SmallScreen>
              </li>
            );
          })}
        </ol>
      </Margins>
    </nav>
  );
}

HorizontalNavigation.propTypes = {
  items: PropTypes.array
};
