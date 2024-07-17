const qs = require('qs');

export const parseState = (str) => {
  return qs.parse(str, { format: 'RFC1738', ignoreQueryPrefix: true });
};

export const stringifyState = (obj) => {
  return qs.stringify(obj, { format: 'RFC1738' });
};

export default function getUrlState (search, keys) {
  const obj = parseState(search);
  /*
   * Build an obj with only the keys we care about
   * from the parsed URL state.
   */
  const state = keys.reduce((memo, key) => {
    if (obj[key]) {
      return { [key]: obj[key], ...memo };
    }

    return memo;
  }, {});

  return state;
}
