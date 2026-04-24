import { defineConfig } from 'astro/config';
import searchIndex from './plugins/search-index-integration.js';

export default defineConfig({
  image: {
    // Allow remote images served from the Drupal CMS
    domains: ['cms.lib.umich.edu'],
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  integrations: [searchIndex()]
});
