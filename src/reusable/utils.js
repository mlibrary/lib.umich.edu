import { css, Global } from '@emotion/react';
import React from 'react';
import styled from '@emotion/styled';

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

export const BREAKPOINTS = {
  EXTRALARGESCREEN: 1200,
  LARGESCREEN: 920,
  MEDIUMSCREEN: 720,
  SMALLSCREEN: 641
};

export const MEDIA_QUERIES = {
  XL: `@media only screen and (min-width: ${BREAKPOINTS.EXTRALARGESCREEN}px)`,
  L: `@media only screen and (min-width: ${BREAKPOINTS.LARGESCREEN}px)`,
  M: `@media only screen and (min-width: ${BREAKPOINTS.MEDIUMSCREEN}px)`,
  S: `@media only screen and (min-width: ${BREAKPOINTS.SMALLSCREEN}px)`,
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

export const Margins = styled('div')({
  margin: '0 auto',
  maxWidth: '1280px',
  padding: `0 ${SPACING.M}`,
  width: '100%',
  [MEDIA_QUERIES.S]: {
    padding: `0 ${SPACING['2XL']}`
  }
});

export const LargeScreen = styled('div')({
  display: 'none',
  [MEDIA_QUERIES.S]: {
    display: 'block'
  }
});

/*
 *"default",
 *"subtle",
 *"light",
 *"special",
 *"list",
 *"list-medium",
 *"list-strong",
 *"description"
 */

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

  /*
   *DEPRECATED kinds
   *To prevent a breaking change direct previously supported
   *link kinds to the default link style.
   */
};

export const SmallScreen = styled('div')({
  display: 'block',
  [MEDIA_QUERIES.S]: {
    display: 'none'
  }
});

export const GlobalStyleSheet = () => {
  /*
   *TODO:
   *- [ ] Import global css from a plain css file.
   *  pros:
   *    - The CSS file would be available on unpkg as part of the lib/ dir
   *  cons:
   *    - Unable to use CSS-in-JS benefits. Such as using values above in the
   *      the global stylesheet.
   *    - Need to setup build process to handle this.
   *  Alternative(s)
   *    - Maybe this stylesheet could be generated into a traditional stylesheet at build.
   *      This could be setup as part of the build step in styles/package.json
   */
  const stylesheet = `
    @import url('https://fonts.googleapis.com/css?family=Crimson+Text|Muli:400,600,700');  
      
    /* 
    CSS Reset
    
    http://meyerweb.com/eric/tools/css/reset/ 
      v2.0 | 20110126
      License: none (public domain)
    */
    
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    /*
      Button CSS reset
    */
    button {
      border: none;
      margin: 0;
      padding: 0;
      width: auto;
      overflow: visible;
      background: transparent;
      /* inherit font, color, and line height from ancestor */
      color: inherit;
      font: inherit;
      line-height: inherit;
      /* Corrects font smoothing for webkit */
      -webkit-font-smoothing: inherit;
      -moz-osx-font-smoothing: inherit;
      /* Corrects inability to style clickable input types in iOS */
      -webkit-appearance: none;
    }
   
    
    /*
      Font family
      Traditionally you would include this in the <head>, but since these styles
      are not being requests as another file to fetch, it's OK to import the
      font family because it's not as slow as tranditional setups.
    */
    body,
    html {
      padding: 0;
      margin: 0;
      font-size: 16px;
      font-family: 'Muli', sans-serif;
      line-height: 1.5;
      color: var(--color-neutral-400);
    }
    
    /*
      Font smoothing and box sizing to border-box.
    */
    * {
      -webkit-font-smoothing: antialiased;
      box-sizing: border-box;
    }
    a {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
    }
    button {
      cursor: pointer;
    }
    
    /*
      Spacing helpers
    */
    .y-spacing > *:not(:last-child) {
      margin-bottom: ${SPACING.XL};
    }
    .x-spacing > *:not(:last-child) {
      margin-right: ${SPACING.XL};
    }
    .layout-flex {
      display: flex;
    }
    /*
      Stop Scroll
    */
    body.stop-scroll {
      height: 100vh;
      overflow: hidden;
    }
  `;

  return (
    <Global
      styles={css`
        ${stylesheet}
      `}
    />
  );
};
