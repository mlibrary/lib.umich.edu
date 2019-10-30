const fetch = require('fetch-retry');
const Bottleneck = require("bottleneck/es5");

function fetchWithRetry(url) {
  return fetch(url, {
    retries: 5,
    retryOn: [500],
    retryDelay: function(attempt) {
      return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
    }
  }).then(function(response) {
    return response.json();
  })
}

const limiter = new Bottleneck({
  maxConcurrent: 25
});

const fetchWithRetryAndLimited = limiter.wrap(fetchWithRetry)

exports.fetch = fetchWithRetryAndLimited