import type { APIRoute } from 'astro';

/**
 * Generates robots.txt at build time.
 *
 * Mirrors the Gatsby gatsby-plugin-robots-txt behaviour:
 *   - Default (development): disallow all crawlers
 *   - ROBOTSTXT_MODE=production: allow all crawlers + Sitemap reference
 *
 * Set ROBOTSTXT_MODE=production to enable crawler access.
 */

const SITE = 'https://www.lib.umich.edu';
const SITEMAP = `${SITE}/sitemap-index.xml`;

const isProduction = import.meta.env.ROBOTSTXT_MODE === 'production';
const mode = isProduction ? 'production' : 'development';
console.log(`[robots.txt] is in ${mode} mode.`);

const robotsTxt = isProduction
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITEMAP}\n`
  : `User-agent: *\nDisallow: /\n`;

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
