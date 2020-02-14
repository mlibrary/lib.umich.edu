export const onClientEntry = () => {
  const {
    applyPolyfills,
    defineCustomElements,
  } = require('@umich-lib/components/loader')

  applyPolyfills().then(() => {
    defineCustomElements(window)
  })
}
