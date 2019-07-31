const fetch = require('fetch-retry');

function fetchWithRetry(url) {
  return fetch(url, {
    retries: 5,
    retryDelay: function(attempt) {
      return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
    }
  }).then(function(response) {
    if (response.status !== 200) {
      console.log('Response status:', response.status)
    }

    return response.json();
  })
}

exports.fetch = fetchWithRetry