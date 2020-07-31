const request = require('request')
const fs = require('fs')
const readline = require('readline')

/**
 * TODO
 *
 * Status: This work is in-progress and not used.
 *
 * Gloal: The goal is to deploy consistent redirect rule numbers to Netlify,
 * which causes warnings.
 */

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

  /**
   * Make sure we always create a new _redirects file.
   * So, lets remove the cached one.
   */
  fs.unlink(filePath, err => {
    if (err) {
      // We expect 'ENOENT' because the file doesn't exist.
      if (!err.code === 'ENOENT') {
        throw err
      }
      console.log('[_redirects] cached _redirects file does not exist.')
    } else {
      console.log('[_redirects] cached _redirects file deleted.')
    }
  })

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
