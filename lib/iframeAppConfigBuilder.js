'use strict';

var stream = require('stream');
var builder = require( './appConfigBuilder' );
var source = require('vinyl-source-stream');

function build(target, opts) {
	if(!target) {
		throw new Error('Missing target');
	}
	var loader = {
		schema: "http://apps.d2l.com/uiapps/iframeschema/v1.json",
		endpoint: target
	};
	return builder.build(opts, loader);
}

function buildStream(target, opts) {
	var appConfig = build(target, opts);
	var passthrough = new stream.PassThrough();
	passthrough.write(JSON.stringify(appConfig, null, '\t'));
	passthrough.end();
	return passthrough.pipe(source('appconfig.json'));
}

module.exports = {
	build: build,
	buildStream: buildStream,
	name: 'iframe'
};
