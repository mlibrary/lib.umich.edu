const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');

const redirectsPath = 'public/_redirects';

const downloadRedirectsFile = async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);

  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', () => {
      const data = fs.readFileSync(redirectsPath, 'utf8');
      /**
       * Just to be sure as a basic check, check if the
       * file contains the first redirect.
       */
      const hasFirstRedirect = data.startsWith(
        'https://umich-lib.netlify.app/* https://lib.umich.edu/:splat 301!'
      );

      if (hasFirstRedirect) {
        // eslint-disable-next-line no-console
        console.log(
          '[redirects] _redirects file was **successfully** created.'
        );
        resolve();
      } else {
        throw new Error(`[redirects] Error! Unable to verify first redirect rule.`);
      }
    });
  });
};

/**
 * Redirects are managed in Drupal. This function downloads it
 * from the appropriate CMS server and makes it available in
 * the public directory, so that Netlify can use it.
 *
 * Production _redirects file: https://cms.lib.umich.edu/_redirects
 * Netlify redirect docs: https://docs.netlify.com/routing/redirects/
 */
const createNetlifyRedirectsFile = async ({ baseUrl }) => {
  const dir = 'public';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  await downloadRedirectsFile(`${baseUrl}/_redirects`, redirectsPath);
};

exports.createNetlifyRedirectsFile = createNetlifyRedirectsFile;

/*
  https://www.gatsbyjs.org/packages/gatsby-plugin-client-side-redirect/
*/
const createLocalRedirects = ({ createRedirect }) => {
  // eslint-disable-next-line no-console
  console.log('[redirects] Creating local redirects.');

  const readInterface = readline.createInterface({
    input: fs.createReadStream('public/_redirects')
  });

  readInterface.on('line', (line) => {
    if (line) {
      const urls = line.split(' ');
      /**
       * Is a local redirect and not
       * a wildcard redirect.
       */
      if (urls[0].startsWith('/') && !urls[0].endsWith('/*')) {
        /*
        Console.log('[redirect] URL:')
        console.log(' - from: ' + urls[0])
        console.log(' - to: ' + urls[1])
        */

        /**
         * Creates at `fromPath` a page with:
         * <meta http-equiv="refresh" content="0; URL='/new-url/'" />
         */
        createRedirect({
          fromPath: urls[0],
          isPermanent: true,
          redirectInBrowser: true,
          toPath: urls[1]
        });
      }
    }
  });
};

exports.createLocalRedirects = createLocalRedirects;
