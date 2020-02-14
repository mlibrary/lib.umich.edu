const glob = require('glob')
const fs = require('fs')
const { renderToString } = require('@umich-lib/components/hydrate')

exports.onPostBuild = async ({}, { module }) => {
  /*
    Server Side Render Stencil Components
  */
  const files = glob.sync('public/**/*.html')
  return Promise.all(
    files.map(async file => {
      try {
        const html = fs.readFileSync(file, 'utf8')
        const result = await renderToString(html)
        fs.writeFileSync(file, result.html)
        return result
      } catch (e) {
        // Ignore error where path is a directory
        if (e.code === 'EISDIR') {
          return
        }
        throw error
      }
    })
  )
}
