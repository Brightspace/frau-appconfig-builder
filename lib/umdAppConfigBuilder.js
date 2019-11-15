'use strict';

var stream = require('stream');
var builder = require('./appConfigBuilder');

function build(target, opts) {
	if (!target) {
		throw new Error('Missing target');
	}

	opts = opts || {};
	var loader = {
		schema: "http://apps.d2l.com/uiapps/umdschema/v1.json",
		endpoint: target,
		showLoading: opts.showLoading ? true : false
	};

	return builder.build(opts, loader);
}

function buildStream(target, opts) {
	var appConfig = build(target, opts);
	var passthrough = new stream.PassThrough();
	passthrough.write(JSON.stringify(appConfig, null, '\t'));
	passthrough.end();
	return passthrough;
}

module.exports = {
	build: build,
	buildStream: buildStream,
	name: 'umd'
};
