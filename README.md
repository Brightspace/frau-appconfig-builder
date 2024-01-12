# frau-appconfig-builder

[![NPM version][npm-image]][npm-url]

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

## Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.

[npm-url]: https://www.npmjs.org/package/frau-appconfig-builder
[npm-image]: https://img.shields.io/npm/v/frau-appconfig-builder.svg
