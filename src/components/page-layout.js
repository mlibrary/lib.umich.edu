import { MEDIA_QUERIES, SPACING } from '../reusable';
import PropTypes from 'prop-types';
import React from 'react';

export const Template = ({ children, ...rest }) => {
  return (
    <div
      css={{
        [MEDIA_QUERIES.S]: {
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
};

Template.propTypes = {
  children: PropTypes.node
};

export const Top = ({ children, ...rest }) => {
  return (
    <div css={{ gridArea: 'top' }} {...rest}>
      {children}
    </div>
  );
};

Top.propTypes = {
  children: PropTypes.node
};

export const Side = ({ children, ...rest }) => {
  return (
    <section
      css={{
        [MEDIA_QUERIES.S]: {
          gridArea: 'side',
          marginRight: SPACING['3XL']
        }
      }}
      {...rest}
    >
      {children}
    </section>
  );
};

Side.propTypes = {
  children: PropTypes.node
};

export const Content = ({ children, ...rest }) => {
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
};

Content.propTypes = {
  children: PropTypes.node
};
