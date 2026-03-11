import { SPACING } from './utils';
import styled from '@emotion/styled';

const Kbd = styled(`kbd`)({
  background: 'white',
  border: 'solid 1px var(--color-neutral-200)',
  borderRadius: '4px',
  boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset',
  display: 'inline-block',
  fontFamily: 'monospace',
  fontSize: '0.85rem',
  padding: `0 ${SPACING['2XS']}`
});

export default Kbd;
