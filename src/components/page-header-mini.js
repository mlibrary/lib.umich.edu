import { COLORS, Heading, Margins, MEDIA_QUERIES, SPACING } from '../reusable';
import Breadcrumb from './breadcrumb';
import PropTypes from 'prop-types';
import React from 'react';

export default function PageHeaderMini ({ breadcrumb, title, ...rest }) {
  return (
    <header
      css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          background: COLORS.blue['100']
        }
      }}
      {...rest}
    >
      <Margins>
        <div
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              flex: '1 1 0'
            },
            paddingLeft: '0',
            paddingRight: SPACING['2XL'],
            paddingTop: '0'
          }}
        >
          <Breadcrumb
            data={breadcrumb}
            css={{
              [MEDIA_QUERIES.LARGESCREEN]: {
                paddingBottom: SPACING.L,
                paddingTop: SPACING.L
              }
            }}
          />
          <Heading
            size='3XL'
            level={1}
            css={{
              paddingBottom: SPACING.L,
              [MEDIA_QUERIES.LARGESCREEN]: {
                marginTop: SPACING.S,
                padding: '0'
              }
            }}
          >
            {title}
          </Heading>
        </div>
      </Margins>
    </header>
  );
}

PageHeaderMini.propTypes = {
  breadcrumb: PropTypes.string,
  title: PropTypes.string
};
