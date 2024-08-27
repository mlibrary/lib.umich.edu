import { SPACING, TYPOGRAPHY } from '../reusable';
import styled from '@emotion/styled';

const Table = styled('table')({
  td: {
    borderBottom: `solid 1px var(--color-neutral-100)`
  },
  th: {
    borderBottom: `solid 2px var(--color-maize-400)`,
    textAlign: 'left',
    ...TYPOGRAPHY['3XS']
  },
  'th, td': {
    padding: SPACING.M,
    paddingLeft: '0'
  },
  width: '100%'
});

export default Table;
