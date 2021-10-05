# frau-appconfig-builder

[![NPM version][npm-image]][npm-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependency Status][dependencies-image]][dependencies-url]

A free-range-app utility for building your FRA's appconfig.json.

## Installation

Install from NPM:
```shell
npm install frau-appconfig-builder
```

## Usage

### From CLI

The FRAU appconfig builder can be run either directly on the console CLI (assuming dependencies are installed) or specified as a script in `package.json`.  Arguments may be passed directly to the CLI, or may be configured in `package.json`.  An environment variable may be specified to indicate local vs. remote (ex. Travis) build environment.

Typical configuration for running in [TRAVIS](https://magnum.travis-ci.com/):

```sh
frau-appconfig-builder --dist|-d ./dist
                       --appfile|-f app.js
                       --loader|-l umd
                       --envvar|-e TRAVIS
                       --showloading|-s
                       --oslo|-o oslo/langterms/
                       + local appresolver options
                       + publisher options
```

In the above example, the CLI utility will use the `envVar` to determine whether to use [frau-local-appresolver](https://github.com/Brightspace/frau-local-appresolver/blob/master/README.md) or [frau-publisher](https://github.com/Brightspace/frau-publisher/blob/master/README.md) to determine the app end-point.  Therefore, the configurations for these CLI utilities are also necessary.

Since this utility, as well as the [frau-local-appresolver](https://github.com/Brightspace/frau-local-appresolver/blob/master/README.md) and [frau-publisher](https://github.com/Brightspace/frau-publisher/blob/master/README.md) utilities are typically used together for a FRA, it is much clearer to simply configure these options in `package.json`:

```json
"scripts": {
  "build:appconfig": "frau-appconfig-builder"
},
"config": {
  "frauAppConfigBuilder": {
    "appFile": "app.js",
    "dist": "./dist",
    "envVar": "TRAVIS",
    "loader": "umd",
    "showLoading": false
  },
  "frauLocalAppResolver": {
    ...
  },
  "frauPublisher": {
    ...
  }
}
```

### From JavaScript

To build the appconfig.json:

```javascript
var builder = require('frau-appconfig-builder').umd; // (umd|html|iframe)
var vfs = require('vinyl-fs');
var target;

if (process.env['TRAVIS']) {
	var publisher = require('gulp-frau-publisher');
	target = publisher.app(options)
		.getLocation() + 'app.js';
} else {
	var localAppResolver = require('frau-local-appresolver');
	target = localAppResolver.resolver(appClass, options)
		.getUrl() + 'app.js';
}

builder.buildStream(target)
	.pipe(vfs.dest('./dist')
	.on('end', function() {
		console.log('appconfig.json created!');
	});
```

**Parameters**:

- `appFile` (required) - The name of the app end-point file (ex. app.js)
- `dist` (required) - The directory where the `appconfig.json` file should be saved
- `envVar` (optional) - The environment variable for checking to determine the build environment (local vs. remote), necessary to resolve app end-point
- `loader` (optional) - The app loader type to be specified in the `appconfig.json`, controls how the FRA will be loaded (ex. umd, iframe, html)
- `showLoading` (optional umd) - Whether to show the loading indicator when using the umd loader. The defaults to false.
- `oslo` (optional) - The oslo translation xml language terms path (ex. oslo/langterms/)

## Contributing

Contributions are welcome, please submit a pull request!

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and contributions should make use of them.

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...
The [sematic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)

[npm-url]: https://www.npmjs.org/package/frau-appconfig-builder
[npm-image]: https://img.shields.io/npm/v/frau-appconfig-builder.svg
[coverage-url]: https://coveralls.io/r/Brightspace/frau-appconfig-builder?branch=master
[coverage-image]: https://img.shields.io/coveralls/Brightspace/frau-appconfig-builder.svg
[dependencies-url]: https://david-dm.org/brightspace/frau-appconfig-builder
[dependencies-image]: https://img.shields.io/david/Brightspace/frau-appconfig-builder.svg
