/**
 * Astro integration that downloads the Netlify _redirects file from
 * the Drupal CMS at build time and writes it to the dist output directory.
 *
 * Redirects are managed in Drupal. At build time this integration fetches:
 *   https://cms.lib.umich.edu/_redirects
 * and writes the result to:
 *   dist/_redirects  (for Netlify to serve)
 *   public/_redirects (to keep the committed file in sync for local dev)
 *
 * Netlify redirect docs: https://docs.netlify.com/routing/redirects/
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const DRUPAL_URL = (process.env.DRUPAL_URL || 'https://cms.lib.umich.edu').replace(/\/$/u, '');
const REDIRECTS_PATH = 'public/_redirects';

/**
 * The first line of the _redirects file is used as a sanity check to
 * confirm the download succeeded and the file is valid.
 */
const FIRST_REDIRECT_LINE = 'https://umich-lib.netlify.app/* https://lib.umich.edu/:splat 301!';

export default function redirectsIntegration() {
  return {
    name: 'redirects-integration',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        console.log('[redirects] Downloading _redirects file from CMS…');

        const url = `${DRUPAL_URL}/_redirects`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`[redirects] Failed to fetch ${url} — HTTP ${res.status}`);
        }

        const content = await res.text();

        if (!content.startsWith(FIRST_REDIRECT_LINE)) {
          throw new Error(
            '[redirects] Error! Unable to verify first redirect rule. The downloaded file may be invalid.'
          );
        }

        // Write to dist/_redirects so Netlify picks it up from the build output
        const distRedirectsPath = fileURLToPath(new URL('_redirects', dir));
        const distDir = dirname(distRedirectsPath);
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true });
        }
        writeFileSync(distRedirectsPath, content, 'utf8');

        // Also write to public/_redirects to keep the committed file in sync
        writeFileSync(REDIRECTS_PATH, content, 'utf8');

        console.log('[redirects] _redirects file was **successfully** created.');
      }
    }
  };
}
