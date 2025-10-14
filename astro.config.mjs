import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Environment variables
const DRUPAL_URL = process.env.DRUPAL_URL || 'https://cms.lib.umich.edu/';

/* eslint-disable no-console */
console.log('[astro.config] ENV VARs');
console.log(`DRUPAL_URL='${DRUPAL_URL}'`);
/* eslint-enable no-console */

// https://astro.build/config
export default defineConfig({
  // Use Netlify adapter for SSR/SSG hybrid rendering
  adapter: netlify(),

  // Image optimization settings (similar to gatsby-plugin-sharp)
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  integrations: [
    // React integration with Emotion support
    react({
      // Allow React components to use Emotion
      babel: {
        plugins: [
          '@emotion/babel-plugin'
        ]
      }
    }),

    // Sitemap generation
    sitemap({
      filter: () => {
        // Optionally filter pages from sitemap
        return true;
      }
    })
  ],

  output: 'static',

  site: 'https://www.lib.umich.edu',

  // Preserve trailing slash behavior from Gatsby
  trailingSlash: 'never',

  // Vite configuration for additional optimization
  vite: {
    ssr: {
      // Externalize Drupal-related packages if needed
      noExternal: ['@emotion/react', '@emotion/styled']
    }
  }
});
