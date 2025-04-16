import { Margins, MEDIA_QUERIES, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export const Template = ({
  children,
  asideWidth,
  contentSide = 'left',
  ...rest
}) => {
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
            gridTemplateAreas: contentSide === 'left'
              ? `"content side"`
              : `"side content"`,
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
  asideWidth: PropTypes.any,
  children: PropTypes.any,
  contentSide: PropTypes.string
};

export const TemplateSide = ({ children, contentSide = 'left', ...rest }) => {
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
            ...(contentSide === 'left'
              ? {
                  borderLeft: 'solid 1px var(--color-neutral-100)',
                  paddingLeft: SPACING['3XL']
                }
              : {
                  borderRight: 'solid 1px var(--color-neutral-100)'
                }),
            paddingBottom: 0
          },
          borderBottom: `solid 1px var(--color-neutral-100)`,
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
  children: PropTypes.any,
  contentSide: PropTypes.string
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
