/**
 * Astro integration that generates a Lunr search index at build time.
 *
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { getPagesToGenerate } from '../src/lib/page-generator.js';
import { getAllUsersForProfiles } from '../src/lib/user-data.js';
import { join } from 'node:path';
import lunr from 'lunr';

export default function searchIndexIntegration() {
  return {
    hooks: {
      'astro:build:done': async ({ dir }) => {
        console.log('[search-index] Generating search index…');

        const [pages, { users }] = await Promise.all([
          getPagesToGenerate(),
          getAllUsersForProfiles()
        ]);

        const store = {};
        const docs = [];

        for (const page of pages) {
          if (page.slug) {
            const ref = `SitePage ${page.slug}`;
            const doc = {
              id: ref,
              keywords: page.keywords || '',
              summary: page.summary || '',
              tag: page.tag || '',
              title: page.title || '',
              uniqname: ''
            };

            docs.push(doc);
            store[ref] = {
              keywords: doc.keywords,
              summary: doc.summary,
              tag: doc.tag,
              title: doc.title
            };
          }
        }

        for (const user of (users || [])) {
          const uniqname = user.attributes?.name;
          if (!uniqname) continue;
          const ref = `SitePage /users/${uniqname}`;
          const doc = {
            id: ref,
            keywords: '',
            summary: user.attributes?.field_user_work_title || '',
            tag: '',
            title: user.attributes?.field_user_display_name || uniqname,
            uniqname
          };

          docs.push(doc);
          store[ref] = {
            keywords: doc.keywords,
            summary: doc.summary,
            tag: doc.tag,
            title: doc.title
          };
        }

        const idx = lunr(function () {
          this.ref('id');
          this.field('title', { boost: 9 });
          this.field('summary', { boost: 3 });
          this.field('keywords');
          this.field('tag');
          this.field('uniqname');

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
    },
    name: 'search-index'
  };
}
