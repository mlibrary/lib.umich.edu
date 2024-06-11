import React from 'react';

import { COLORS, Margins, SPACING } from '../reusable';

import MEDIA_QUERIES from '../reusable/media-queries';

export function Template ({ children, asideWidth, ...rest }) {
  const asWidth = asideWidth ? asideWidth : '21rem';

  return (
    <Margins>
      <div
        css={{
          paddingBottom: SPACING.XL,
          [MEDIA_QUERIES.XL]: {
            paddingBottom: SPACING['3XL'],
            display: 'grid',
            gridTemplateAreas: `
              "content side"
            `,
            gridTemplateColumns: `1fr calc(${asWidth} + ${SPACING['4XL']}) `
          },
          '[data-panel-margins], [data-panel]': {
            padding: '0'
          },
          '[data-panel] h2': {
            marginTop: SPACING['2XL']
          }
        }}
        {...rest}
      >
        {children}
      </div>
    </Margins>
  );
}

export function TemplateSide ({ children, ...rest }) {
  return (
    <section
      css={{
        [MEDIA_QUERIES.L]: {
          gridArea: 'side'
        }
      }}
      {...rest}
    >
      <div
        css={{
          [MEDIA_QUERIES.XL]: {
            paddingLeft: SPACING['3XL'],
            borderLeft: `solid 1px ${COLORS.neutral['100']}`,
            borderBottom: 'none',
            paddingBottom: 0
          },
          borderBottom: `solid 1px ${COLORS.neutral['100']}`,
          paddingBottom: SPACING['2XL'],
          marginBottom: SPACING['2XL']
        }}
      >
        {children}
      </div>
    </section>
  );
}

export function TemplateContent ({ children, ...rest }) {
  return (
    <div
      css={{
        [MEDIA_QUERIES.L]: {
          gridArea: 'content',
          marginRight: SPACING['2XL']
        },
        marginBottom: SPACING.XL
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
