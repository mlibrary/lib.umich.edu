import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import searchIndex from './plugins/search-index-integration.js';
import redirects from './plugins/redirects-integration.js';
import cmsFiles from './plugins/cms-files-integration.js';

export default defineConfig({
  site: 'https://www.lib.umich.edu',
  image: {
    // Allow remote images served from the Drupal CMS
    domains: ['cms.lib.umich.edu'],
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/users/') && !page.endsWith('/404')
    }),
    searchIndex(),
    redirects(),
    cmsFiles()
  ]
});
