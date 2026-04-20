/**
 * Astro integration that generates a Lunr search index at build time.
 *
 */
import lunr from 'lunr';
import { getPagesToGenerate } from '../src/lib/page-generator.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export default function searchIndexIntegration() {
  return {
    name: 'search-index',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        console.log('[search-index] Generating search index…');

        const pages = await getPagesToGenerate();

        const store = {};
        const docs = [];

        for (const page of pages) {
          if (!page.slug) continue;

          const ref = `SitePage ${page.slug}`;
          const doc = {
            id: ref,
            title: page.title || '',
            summary: page.summary || '',
            keywords: page.keywords || '',
            tag: page.tag || ''
          };

          docs.push(doc);
          store[ref] = {
            title: doc.title,
            summary: doc.summary,
            keywords: doc.keywords,
            tag: doc.tag
          };
        }

        const idx = lunr(function () {
          this.ref('id');
          this.field('title', { boost: 9 });
          this.field('summary', { boost: 3 });
          this.field('keywords');
          this.field('tag');

          docs.forEach((doc) => {
            this.add(doc);
          });
        });

        const searchData = {
          en: {
            index: idx.toJSON(),
            store
          }
        };

        const outDir = dir instanceof URL ? dir.pathname : String(dir);
        const normalised = outDir.replace(/^\/([A-Za-z]:)/u, '$1');
        const outPath = join(normalised, 'search_index.json');
        mkdirSync(normalised, { recursive: true });
        writeFileSync(outPath, JSON.stringify(searchData));

        console.log(`[search-index] Wrote ${docs.length} pages to ${outPath}`);
      }
    }
  };
}
