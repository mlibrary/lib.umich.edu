import { COLORS, Margins, SPACING } from '../reusable';
import MEDIA_QUERIES from '../reusable/media-queries';
import PropTypes from 'prop-types';
import React from 'react';

export const Template = ({ children, asideWidth, ...rest }) => {
  const asWidth = asideWidth ? asideWidth : '21rem';

  return (
    <Margins>
      <div
        css={{
          '[data-panel-margins], [data-panel]': {
            padding: '0'
          },
          '[data-panel] h2': {
            marginTop: SPACING['2XL']
          },
          paddingBottom: SPACING.XL,
          [MEDIA_QUERIES.XL]: {
            display: 'grid',
            gridTemplateAreas: `
            "content side"
            `,
            gridTemplateColumns: `1fr calc(${asWidth} + ${SPACING['4XL']}) `,
            paddingBottom: SPACING['3XL']
          }
        }}
        {...rest}
      >
        {children}
      </div>
    </Margins>
  );
};

Template.propTypes = {
  asideWidth: PropTypes.string,
  children: PropTypes.array
};

export const TemplateSide = ({ children, ...rest }) => {
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
            borderBottom: 'none',
            borderLeft: `solid 1px var(--colors-neutral-100)`,
            paddingBottom: 0,
            paddingLeft: SPACING['3XL']
          },
          borderBottom: `solid 1px var(--colors-neutral-100)`,
          marginBottom: SPACING['2XL'],
          paddingBottom: SPACING['2XL']
        }}
      >
        {children}
      </div>
    </section>
  );
};

TemplateSide.propTypes = {
  children: PropTypes.any
};

export const TemplateContent = ({ children, ...rest }) => {
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
};

TemplateContent.propTypes = {
  children: PropTypes.array
};
