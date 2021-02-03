## 🚀 Quick start

1.  **Clone `lib.umich.edu`.**

```sh
git clone https://github.com/mlibrary/lib.umich.edu.git
```

2.  **Install dependencies.**

Navigate into your site’s directory and install dependencies with NPM.

```sh
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

```sh
npm start
```

If you wish to pull data from the staging CMS rather than the production CMS, then use this command:

```sh
npm run start:staging
```

## Builds

```sh
npm run build
```

## Help and troubleshooting

Sometimes when changing git branches for example you might need to run Gatsby clean.

```
npm run clean
npm start
```

https://www.gatsbyjs.org/docs/gatsby-cli/#clean

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── yarn.lock

1.  **`/node_modules`**: The directory where all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser), like your site header, or a page template. “Src” is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for a tool called [Prettier](https://prettier.io/), which is a tool to help keep the formatting of your code consistent.

5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://next.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://next.gatsbyjs.org/docs/gatsby-config/) for more detail).

7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby node APIs](https://next.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://next.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

9.  **`LICENSE`**: Gatsby is licensed under the MIT license.

10. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. (You won’t change this file directly).

11. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

12. **`README.md`**: A text file containing useful reference information about your project.

13. **`yarn.lock`**: [Yarn](https://yarnpkg.com/) is a package manager alternative to npm. You can use either yarn or npm, though all of the Gatsby docs reference npm. This file serves essentially the same purpose as `package-lock.json`, just for a different package management system.

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://next.gatsbyjs.org/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://next.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples head [to our documentation](https://next.gatsbyjs.org/docs/).** In particular, check out the “Guides”, API reference, and “Advanced Tutorials” sections in the sidebar.
