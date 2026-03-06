/* eslint-disable sort-keys, id-length */
export const SPACING = {
  '3XS': '0.125rem',
  '2XS': '0.25rem',
  XS: '0.5rem',
  S: '0.75rem',
  M: '1rem',
  L: '1.5rem',
  XL: '2rem',
  '2XL': '2.5rem',
  '3XL': '3rem',
  '4XL': '4rem',
  '5XL': '6rem'
};

export const MEDIA_QUERIES = {
  XL: `@media only screen and (min-width: 1200px)`,
  L: `@media only screen and (min-width: 920px)`,
  M: `@media only screen and (min-width: 720px)`,
  S: `@media only screen and (min-width: 641px)`,
  PRINT: '@media print'
};

const TYPE_2XL = {
  fontFamily: 'Crimson Text',
  fontSize: '2.25rem',
  lineHeight: '1.25'
};

export const Z_SPACE = {
  8: {
    boxShadow: `0 2px 8px 0 rgba(0,0,0,0.2)`
  },
  16: {
    boxShadow: `0 4px 16px 0 rgba(0,0,0,0.12)`
  }
};

export const TYPOGRAPHY = {
  '3XL': {
    ...TYPE_2XL,
    [MEDIA_QUERIES.S]: {
      fontFamily: 'Crimson Text',
      fontSize: '3.5rem',
      lineHeight: '1.125'
    }
  },
  '2XL': TYPE_2XL,
  XL: {
    fontSize: '2rem',
    fontWeight: '800',
    lineHeight: '1.25'
  },
  L: {
    fontSize: '1.75rem',
    fontWeight: '600',
    lineHeight: '1.25'
  },
  M: {
    fontSize: '1.5rem',
    fontWeight: '600',
    lineHeight: '1.25'
  },
  S: {
    fontSize: '1.25rem',
    fontWeight: '600'
  },
  XS: {
    fontSize: '1.125rem'
  },
  '2XS': {
    fontSize: '1rem'
  },
  '3XS': {
    fontSize: '0.875rem',
    fontWeight: '800',
    letterSpacing: '1.25px',
    textTransform: 'uppercase'
  }
};
/* eslint-enable sort-keys, id-length */

export const INTENT_COLORS = {
  error: 'var(--color-orange-400)',
  informational: 'var(--color-blue-400)',
  success: 'var(--color-teal-400)',
  warning: 'var(--color-maize-400)'
};

const DEFAULT_LINK_STYLE = {
  ':hover': {
    boxShadow: `inset 0 -2px var(--color-teal-400)`
  },
  boxShadow: `inset 0 -1px var(--color-teal-400)`,
  color: 'var(--color-teal-400)'
};

export const LINK_STYLES = {
  default: DEFAULT_LINK_STYLE,
  description: {
    ...TYPOGRAPHY.XS,
    ':hover': {
      boxShadow: `inset 0 -2px var(--color-teal-400)`
    },
    boxShadow: `inset 0 -1px var(--color-teal-400)`,
    color: 'var(--color-neutral-400)',
    fontWeight: '600'
  },
  light: {
    ':hover': {
      boxShadow: `inset 0 -2px white`
    },
    boxShadow: `inset 0 -1px white`,
    color: 'white'
  },
  list: {
    ':hover': {
      boxShadow: `inset 0 -1px var(--color-neutral-400)`
    },
    color: 'var(--color-neutral-400)'
  },
  'list-medium': {
    ':hover': {
      boxShadow: `inset 0 -2px var(--color-teal-400)`
    },
    fontWeight: '600'
  },
  'list-strong': {
    ':hover': {
      boxShadow: `inset 0 -1px var(--color-neutral-400)`
    },
    color: 'var(--color-neutral-400)',
    fontWeight: '800'
  },
  special: {
    ...TYPOGRAPHY['3XS'],
    ':hover': {
      boxShadow: `inset 0 -1px var(--color-neutral-300)`
    },
    color: 'var(--color-neutral-300)'
  },
  'special-subtle': DEFAULT_LINK_STYLE,
  subtle: {
    ':hover': {
      boxShadow: `inset 0 -2px var(--color-neutral-300)`
    },
    boxShadow: `inset 0 -1px var(--color-neutral-300)`,
    color: 'var(--color-neutral-400)'
  }
};
