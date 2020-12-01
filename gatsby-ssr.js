const React = require('react')
const PageWrap = require('./src/components/page-wrap')

// Wraps every page in a component
exports.wrapPageElement = ({ element, props }) => {
  return <PageWrap {...props} element={element} />
}
