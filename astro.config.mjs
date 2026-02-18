import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    // Allow remote images served from the Drupal CMS
    domains: ['cms.lib.umich.edu']
  }
});
