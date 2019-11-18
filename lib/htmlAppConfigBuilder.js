'use strict';

var stream = require('stream');
var packageJson = require('./packageJson');
var builder = require('./appConfigBuilder');
var source = require('vinyl-source-stream');

function build(opts) {
	opts = opts || {};

	var pjson = packageJson.read();

	var loader = {
		schema: "http://apps.d2l.com/uiapps/htmlschema/v1.json",
		defaultResource: opts.defaultResource || pjson.appDefaultResource,
		additionalResources: opts.additionalResources || pjson.appAccessibleResources
	};

	if (!loader.defaultResource) {
		throw new Error('defaultResource was not specified and can\'t be found in package.json');
	}

	return builder.build(opts, loader);
}

function buildStream(opts) {
	var appConfig = build(opts);
	var passthrough = new stream.PassThrough();
	passthrough.write(JSON.stringify(appConfig, null, '\t'));
	passthrough.end();
	return passthrough.pipe(source('appconfig.json'));
}

module.exports = {
	build: build,
	buildStream: buildStream,
	name: 'html'
};
