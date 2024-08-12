const originalFetch = require('isomorphic-fetch');
const fetch = require('fetch-retry')(originalFetch);
const Bottleneck = require('bottleneck/es5');

const fetchWithRetry = (url) => {
  return fetch(url, {
    retries: 5,
    retryDelay (attempt) {
      // 1000, 2000, 4000
      return 2 ** attempt * 1000;
    },
    retryOn: [500]
  }).then((response) => {
    return response.json();
  });
};

const limiter = new Bottleneck({
  maxConcurrent: 20
});

const fetchWithRetryAndLimited = limiter.wrap(fetchWithRetry);

exports.fetch = fetchWithRetryAndLimited;
