// Why these sharp settings?
// See: https://github.com/gatsbyjs/gatsby/issues/6291
const sharp = require('sharp')
sharp.cache(false)
sharp.simd(false)
