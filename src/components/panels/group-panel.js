import { COLORS, Margins, MEDIA_QUERIES, SPACING } from '../../reusable';
import Panels from './index';
import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable id-length, sort-keys */
const MEDIAQUERIES = {
  XL: '@media only screen and (min-width: 1200px)',
  L: '@media only screen and (min-width:920px)',
  M: '@media only screen and (min-width: 720px)',
  S: MEDIA_QUERIES.LARGESCREEN
};
/* eslint-enable id-length, sort-keys */

export default function GroupPanel ({ data }) {
  const { field_panel_group_layout: fieldPanelGroupLayout, relationships } = data;

  if (fieldPanelGroupLayout === '50') {
    const { field_panel_group: fieldPanelGroup } = relationships;

    return (
      <PanelGroup50Container>
        <Panels data={fieldPanelGroup} />
      </PanelGroup50Container>
    );
  }

  return null;
}

GroupPanel.propTypes = {
  data: PropTypes.object
};

const PanelGroup50Container = ({ children }) => {
  return (
    <Margins>
      <div
        css={{
          '> *': {
            marginBottom: SPACING.XL,
            paddingBottom: SPACING.XL,
            [MEDIAQUERIES.L]: {
              marginBottom: SPACING['2XL'],
              paddingBottom: SPACING['2XL']
            }
          },
          '> *:not(:last-child)': {
            borderBottom: `solid 1px var(--colors-neutral-100)`,
            [MEDIAQUERIES.L]: {
              border: 'none',
              borderRight: `solid 1px ${COLORS.neutral[100]}`,
              paddingRight: SPACING['3XL']
            }
          },
          display: 'grid',
          [MEDIAQUERIES.L]: {
            gridGap: SPACING['3XL'],
            gridTemplateColumns: '1fr 1fr'
          },
          marginTop: SPACING.XL
        }}
      >
        {children}
      </div>
    </Margins>
  );
};

PanelGroup50Container.propTypes = {
  children: PropTypes.object
};
