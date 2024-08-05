/* eslint-disable camelcase */
const originalFetch = require('isomorphic-fetch');
const fetch = require('fetch-retry')(originalFetch);

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, reporter },
  { api, client }
) => {
  reporter.info(`[gatsby-source-libguides] Started ...`);
  if (!api.url || !client.url || !client.id || !client.secret) {
    reporter.error(
      `[gatsby-source-libguides]`,
      new Error('Not configured. Exiting ...')
    );

    return; // Tell Gatsby we're done.
  }

  const clientTokenFetch = async () => {
    const bodyObj = {
      client_id: client.id,
      client_secret: client.secret,
      grant_type: 'client_credentials'
    };
    const bodyKeys = Object.keys(bodyObj).map(
      (key) => {
        return `${key}=${bodyObj[key]}`;
      }
    );
    const options = {
      body: bodyKeys.join('&'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    };

    return fetch(client.url, options)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        return data;
      })
      .catch(() => {
        reporter.error(
          `[gatsby-source-libguides]`,
          new Error('Unable to authenticate.')
        );
      });
  };

  const clientData = await clientTokenFetch();

  const fetchGuides = async () => {
    const options = {
      headers: {
        Authorization: `Bearer ${clientData.access_token}`
      },
      method: 'GET'
    };

    return fetch(api.url, options)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        return data;
      })
      .catch(() => {
        reporter.error(
          `[gatsby-source-libguides]`,
          new Error('Unable to fetch from API.')
        );
      });
  };

  const guidesData = await fetchGuides();

  /*
    Source node time!
  */

  const { createNode } = actions;

  guidesData.forEach((guide) => {
    const nodeContent = JSON.stringify(guide);
    const nodeMeta = {
      children: [],
      id: createNodeId(`libguide-${guide.id}`),
      internal: {
        content: nodeContent,
        contentDigest: createContentDigest(guide),
        type: 'LibGuide'
      },
      parent: null
    };
    const node = { ...guide, ...nodeMeta };
    createNode(node);
  });

  reporter.info(`[gatsby-source-libguides] Done.`);

  // Tell Gatsby we're done sourcing nodes.
};
