const fetch = require('fetch-retry');

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

exports.fetch = fetchWithRetry