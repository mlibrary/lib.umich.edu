const request = require('request')
const fs = require('fs')
const readline = require('readline')

/**
 * Redirects are managed in Drupal. This function downloads it
 * from the appropriate CMS server and makes it available in
 * the public directory, so that Netlify can use it.
 *
 * Production _redirects file: https://cms.lib.umich.edu/_redirects
 * Netlify redirect docs: https://docs.netlify.com/routing/redirects/
 */
async function createNetlifyRedirectsFile({ baseUrl }) {
  const dir = 'public'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const firstRedirectLine =
    'https://umich-lib.netlify.app/* https://lib.umich.edu/:splat 301!'
  const filePath = dir + '/_redirects'
  let redirectsFile = fs.createWriteStream(filePath)

  await new Promise((resolve, reject) => {
    request({
      uri: baseUrl + '/_redirects',
    })
      .pipe(redirectsFile)
      .on('finish', () => {
        const data = fs.readFileSync(filePath, 'utf8')
        /**
         * Just to be sure as a basic check, check if the
         * file contains the first redirect.
         */
        const isValid = data.startsWith(firstRedirectLine)

        if (isValid) {
          console.log('[_redirects] _redirects file was successfully created.')
          resolve()
        } else {
          const msg = `[_redirects] Error: Expected the first redirect line to be: ${firstRedirectLine}`
          throw msg
        }
      })
      .on('error', error => {
        console.log('[_redirects] had an error creating the file.')
        reject(error)
      })
  }).catch(error => {
    const msg = `[_redirects] Error: ${error}`
    throw msg
  })
}

exports.createNetlifyRedirectsFile = createNetlifyRedirectsFile

function createClientSideRedirects({ createRedirect }) {
  if (!createRedirect) {
    throw 'createClientSideRedirects requires createRedirect arg'
  }

  const readInterface = readline.createInterface({
    input: fs.createReadStream('public/_redirects'),
  })

  readInterface.on('line', function(line) {
    if (line) {
      const urls = line.split(' ')
      /**
       * Creating client-side redirect from ' + urls[0] + ' to ' + urls[1]
       */
      createRedirect({
        fromPath: urls[0],
        toPath: urls[1],
        isPermanent: true,
        redirectInBrowser: true,
        force: true,
      })
    }
  })
}

exports.createClientSideRedirects = createClientSideRedirects
