/**
 * CMS File Cache
 *
 * Downloads remote CMS files (images, PDFs, etc.) to the local public/
 * directory during the Astro build, so they are served as local static
 * assets instead of exposing direct CMS URLs.
 *
 * Mirrors what gatsby-source-drupal did automatically via createRemoteFileNode.
 *
 * Files are stored at: public/cms-files/[md5-of-url]/[filename]
 * Served at:           /cms-files/[md5-of-url]/[filename]
 */

import { createHash } from 'crypto';
import { mkdir, access, writeFile } from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const FILES_SUBDIR = 'cms-files';

// In-memory cache: URL -> local path (lives for the duration of the build/dev session)
const urlCache = new Map();

/**
 * Downloads a CMS file URL to public/cms-files/[hash]/[filename] and
 * returns the local URL path, e.g. /cms-files/abc123/HatcherN_Basement.pdf
 *
 * Falls back to the original URL if the download fails so the page still renders.
 *
 * @param {string} url - Absolute CMS URL to download
 * @returns {Promise<string>} Local URL path or original URL on failure
 */
export async function downloadCmsFile(url) {
  if (!url) return url;
  if (urlCache.has(url)) return urlCache.get(url);

  try {
    const urlObj = new URL(url);
    const urlHash = createHash('md5').update(url).digest('hex');
    const filename = path.basename(urlObj.pathname);
    const subDir = path.join(PUBLIC_DIR, FILES_SUBDIR, urlHash);
    const filePath = path.join(subDir, filename);
    const localUrl = `/${FILES_SUBDIR}/${urlHash}/${filename}`;

    // Check if already downloaded (from a previous build run or earlier in this run)
    let alreadyExists = false;
    try {
      await access(filePath);
      alreadyExists = true;
    } catch {
      // File doesn't exist yet — will download below
    }

    if (!alreadyExists) {
      await mkdir(subDir, { recursive: true });
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} fetching ${url}`);
      }
      const buffer = await response.arrayBuffer();
      await writeFile(filePath, Buffer.from(buffer));
    }

    urlCache.set(url, localUrl);
    return localUrl;
  } catch (err) {
    /* eslint-disable no-console */
    console.warn(`[cms-file-cache] Could not download ${url}: ${err.message}`);
    /* eslint-enable no-console */
    // Fall back to original CMS URL so the page still renders
    return url;
  }
}
