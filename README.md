# lib.umich.edu

[lib.umich.edu](https://lib.umich.edu/) is a headless [Drupal](https://www.drupal.org/) site, built with [Gatsby](https://www.gatsbyjs.com/) and (React)[https://react.dev/] as the front-end.

## 🚀 Quick start

1.  **Clone `lib.umich.edu`.**

```shell
gh repo clone mlibrary/lib.umich.edu
```

2.  **Install dependencies.**

Navigate into your site’s directory and install dependencies with NPM.

```shell
cd lib.umich.edu/
npm install
```

3.  **Configuration**

```
ROBOTSTXT_MODE=production
```

If `ROBOTSTXT_MODE` is set to `production`, this tells the build to make a `robots.txt` that allows search engines to crawl the site. If your build is not for production, then don't set this variable or set it to `development` if needed.

```
CONTEXT=production
```

This env var is automatically available when building on Netlify, but if you're building the site **not** with Netlify set `CONTEXT` as `production`, otherwise `ROBOTSTXT_MODE` will not work as expected.

```
DRUPAL_URL=https://cms.staging.lib.umich.edu/
```

The site by default will build and pull data from `https://cms.lib.umich.edu/`, but you can change that with setting `DRUPAL_URL`.

```
DRUPAL_CONCURRENT_FILE_REQUESTS
```

You can _optionally_ set `DRUPAL_CONCURRENT_FILE_REQUESTS` to adjust the [`gatsby-source-drupal` `concurrentFileRequests` option](https://www.gatsbyjs.com/plugins/gatsby-source-drupal/#concurrent-file-requests) (defaults to `20`) to change how many simultaneous file requests are made to the server/service. This benefits build speed, however too many concurrent file request could cause memory exhaustion depending on the machines memory size so change with caution.

For example, run:

```
DRUPAL_CONCURRENT_FILE_REQUESTS=60 npm start
```

or

```
DRUPAL_CONCURRENT_FILE_REQUESTS=5 npm start
```

And see what works best for your network connection, memory, and general situation.

4.  **Start developing.**

Start it up.

```shell
npm start
```

If you wish to pull data from the staging CMS rather than the production CMS, then use this command:

```shell
npm run develop:staging
```

If you wish to create a production build, then use this command:

```shell
npm run start:production
```

⏳ **Hang tight!** Building the site can take an average of **20 minutes**.

## ❔ Help and troubleshooting

Sometimes when changing git branches for example you might need to run Gatsby clean.

```
npm run clean
npm start
```
