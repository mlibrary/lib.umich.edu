import React from 'react';
import { MEDIA_QUERIES, SPACING } from '../reusable';

export function Template ({ children, ...rest }) {
  return (
    <div
      css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          display: 'grid',
          gridTemplateAreas: `
            "top top"
            "side content"
          `,
          gridTemplateColumns: `calc(216px + ${SPACING['4XL']}) 1fr`,
          gridTemplateRows: 'auto 1fr',
          marginBottom: SPACING['5XL']
        },
        '[data-panel-margins], [data-panel]': {
          padding: '0'
        },
        '[data-panel] h2': {
          marginTop: SPACING['2XL']
        },
        marginBottom: SPACING['4XL']
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Top ({ children, ...rest }) {
  return (
    <div css={{ gridArea: 'top' }} {...rest}>
      {children}
    </div>
  );
}

export function Side ({ children, ...rest }) {
  return (
    <section
      css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          gridArea: 'side',
          marginRight: SPACING['3XL']
        }
      }}
      {...rest}
    >
      {children}
    </section>
  );
}

export function Content ({ children, ...rest }) {
  return (
    <div
      css={{
        gridArea: 'content',
        marginBottom: SPACING.XL
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
