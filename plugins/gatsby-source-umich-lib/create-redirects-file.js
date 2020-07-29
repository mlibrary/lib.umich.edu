const request = require('request')
const fs = require('fs')

async function createRedirectsFile({ baseUrl }) {
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

exports.createRedirectsFile = createRedirectsFile
