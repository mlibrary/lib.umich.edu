import styled from '@emotion/styled';

import { COLORS, SPACING, TYPOGRAPHY } from '../reusable';

const Table = styled('table')({
  width: '100%',
  th: {
    textAlign: 'left',
    borderBottom: `solid 2px ${COLORS.maize[400]}`,
    ...TYPOGRAPHY['3XS']
  },
  'th, td': {
    padding: SPACING.M,
    paddingLeft: '0'
  },
  td: {
    borderBottom: `solid 1px ${COLORS.neutral[100]}`
  }
});

export default Table;
