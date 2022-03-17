const qs = require('qs');

export function parseState(str) {
  return qs.parse(str, { ignoreQueryPrefix: true, format: 'RFC1738' });
}

export function stringifyState(obj) {
  return qs.stringify(obj, { format: 'RFC1738' });
}

export default function getUrlState(search, keys) {
  const obj = parseState(search);
  // Build an obj with only the keys we care about
  // from the parsed URL state.
  const state = keys.reduce((memo, k) => {
    if (obj[k]) {
      memo = { [k]: obj[k], ...memo };
    }

    return memo;
  }, {});

  return state;
}
