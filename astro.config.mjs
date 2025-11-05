import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Minimal Astro config enabling React components in .astro files
export default defineConfig({
  integrations: [react()]
});
