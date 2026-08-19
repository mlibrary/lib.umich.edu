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

// Max simultaneous requests to the CMS. Pages like the staff directory can
// trigger hundreds of downloads in one Promise.all(); firing them all at
// once was overwhelming the CMS origin and causing cascading 504s.
const MAX_CONCURRENT_DOWNLOADS = 8;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;
const FETCH_TIMEOUT_MS = 20000;

let activeDownloads = 0;
const downloadQueue = [];

function runNext () {
  if (activeDownloads >= MAX_CONCURRENT_DOWNLOADS) return;
  const next = downloadQueue.shift();
  if (!next) return;
  activeDownloads++;
  next.task().then(next.resolve, next.reject).finally(() => {
    activeDownloads--;
    runNext();
  });
}

function withConcurrencyLimit (task) {
  return new Promise((resolve, reject) => {
    downloadQueue.push({ task, resolve, reject });
    runNext();
  });
}

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout (url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// Transient errors (gateway timeouts, connection resets, etc.) are worth
// retrying since the CMS often recovers a moment later.
function isRetryableStatus (status) {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

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

  const result = await withConcurrencyLimit(() => attemptDownload(url));
  urlCache.set(url, result);
  return result;
}

async function attemptDownload(url) {
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

      let lastErr;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          const response = await fetchWithTimeout(url);
          if (!response.ok) {
            const err = new Error(`HTTP ${response.status} fetching ${url}`);
            err.status = response.status;
            throw err;
          }
          const buffer = await response.arrayBuffer();
          await writeFile(filePath, Buffer.from(buffer));
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          const retryable = err.status ? isRetryableStatus(err.status) : true;
          if (!retryable || attempt === MAX_ATTEMPTS) break;
          await sleep(RETRY_BASE_DELAY_MS * attempt);
        }
      }
      if (lastErr) throw lastErr;
    }

    return localUrl;
  } catch (err) {
    /* eslint-disable no-console */
    console.warn(`[cms-file-cache] Could not download ${url}: ${err.message}`);
    /* eslint-enable no-console */
    // Fall back to original CMS URL so the page still renders
    return url;
  }
}
