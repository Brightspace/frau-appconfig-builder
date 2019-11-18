const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const builder = require('../lib/htmlAppConfigBuilder');
const stream = require('stream');

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

const OPTS = createValidOpts();

describe('htmlAppConfigBuilder', () => {

	describe('build', () => {

		describe('loader', () => {

			it('should exist', () => {
				builder.build(OPTS)
					.should.have.property('loader');
			});

			it('should have correct schema', () => {
				builder.build(OPTS).loader
					.should.have.property('schema', 'http://apps.d2l.com/uiapps/htmlschema/v1.json' );
			});

			describe('defaults', () => {

				const DEFAULT_RESOURCE = 'resource';
				const ACCESSIBLE_RESOURCES = 'other-resources';

				let stub;

				before( () => {
					stub = sinon
						.stub(require('../lib/packageJson'), 'read')
						.returns({
							appDefaultResource: DEFAULT_RESOURCE,
							appAccessibleResources: ACCESSIBLE_RESOURCES
						});
				});

				after( ()=> {
					stub.restore();
				});

				it('defaultResource', () => {
					const opts = createValidOptsWithout('defaultResource');

					builder.build(opts).loader
						.should.have.property('defaultResource', DEFAULT_RESOURCE);
				});

				it('additionalResources', () => {
					builder.build(OPTS).loader
						.should.have.property('additionalResources', ACCESSIBLE_RESOURCES);
				});

			});

			describe('arguments', () => {
				['defaultResource', 'additionalResources' ].forEach((arg) => {
					it(arg, () => {
						const VALUE = 'some-value';
						const opts = createValidOpts();
						opts[arg] = VALUE;

						builder.build(opts).loader.should.have.property(arg, VALUE);
					});
				});
			});

			describe('missing values', () => {
				it('defaultResource', () => {
					const opts = createValidOptsWithout('defaultResource');

					expect( ()=> {
						builder.build(opts);
					}).to.throw('defaultResource was not specified and can\'t be found in package.json');
				});

			});

		});
	});

	describe('buildStream', () => {

		it('should return a stream that contains correct data', () => {
			const val = builder.buildStream(OPTS);
			val.should.instanceOf(stream.Stream);
			const contents = val.read().toString();
			const data = JSON.parse(contents);
			data.should.have.property('schema');
			data.should.have.property('metadata');
			data.should.have.property('loader');
			data.loader.should.have.property('schema', 'http://apps.d2l.com/uiapps/htmlschema/v1.json' );
			data.loader.should.have.property('defaultResource', 'test' );
		});

	});
});

function createValidOpts() {
	return {
		version: '1.0.0-alpha.1',
		description: 'It is a small world',
		id: 'urn:d2l:fra:id:some-id',
		defaultResource: 'test'
	};
}

function createValidOptsWithout(str) {
	var opts = createValidOpts();
	delete opts[str];
	return opts;
}
