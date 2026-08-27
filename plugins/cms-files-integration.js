/**
 * Astro integration that re-syncs downloaded CMS files into the dist output.
 *
 * downloadCmsFile() (src/lib/cms-file-cache.js) downloads remote CMS files
 * (staff photos, PDFs, etc.) into public/cms-files/ as a side effect of
 * rendering pages during the build. Astro's Vite-based build copies public/
 * into dist as part of the client build step, which runs *before* page
 * rendering (and therefore before these downloads happen) — so anything
 * downloaded during rendering never makes it into dist's copy of public/.
 * This mirrors the same fix already applied in redirects-integration.js.
 */

import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PUBLIC_CMS_FILES_DIR = 'public/cms-files';

export default function cmsFilesIntegration() {
  return {
    name: 'cms-files-integration',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (!existsSync(PUBLIC_CMS_FILES_DIR)) return;

        console.log('[cms-files] Syncing downloaded CMS files into dist output…');
        const distCmsFilesDir = fileURLToPath(new URL('cms-files', dir));
        cpSync(PUBLIC_CMS_FILES_DIR, distCmsFilesDir, { recursive: true });
      }
    }
  };
}
