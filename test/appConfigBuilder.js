const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const builder = require('../lib/appConfigBuilder');

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

const SIMPLE_PARAMETERS = ['version', 'id', 'description'];
const LOADER = 'test';

describe('appConfigBuilder', () => {

	describe('build', () => {

		it('should have correct schema', () => {
			builder.build(createValidOpts(), LOADER)
				.should.have.property('schema', 'http://apps.d2l.com/uiapps/config/v1.1.json');
		});

		it('should accept null options', () => {

			const spy = sinon.stub(require('../lib/packageJson'), 'read')
				.returns({
					version: '1.0.0-alpha.1',
					description: 'It is a small world',
					appId: 'urn:d2l:fra:id:some-id'
				});

			expect(function() { builder.build(null, LOADER); }).to.not.throw();

			spy.restore();

		});

		describe('loader', () => {

			it('should fail with no loader', () => {
				expect( ()=> {
					builder.build(createValidOpts());
				}).to.throw('Missing loader information');
			});

			it('should use given loader', () => {
				const loader = 'test';
				builder.build(createValidOpts(), loader)
					.should.have.property('loader', loader);
			});

		});

		describe('metadata', () => {

			it('should exist', () => {
				builder.build(createValidOpts(), LOADER)
					.should.have.property('metadata');
			});

			describe('defaults', () => {
				let stub;

				before( () =>  {
					stub = sinon.stub(require('../lib/packageJson'), 'read');
				});

				after(() => {
					stub.restore();
				});

				it('version', () => {
					const VALUE = '12.123.124';
					stub.returns({ version: VALUE });

					builder.build(createValidOptsWithout('version'), LOADER).metadata
						.should.have.property( 'version', VALUE );
				});

				it('id', () => {
					const VALUE = 'urn:d2l:fra:id:some-id';
					stub.returns({ appId: VALUE });

					builder.build(createValidOptsWithout('id'), LOADER).metadata
						.should.have.property( 'id', VALUE );
				});

				it('description', () => {
					const VALUE = '12.123.124';
					stub.returns({ description: VALUE });

					builder.build(createValidOptsWithout('description'), LOADER).metadata
						.should.have.property( 'description', VALUE );
				});

			});

			describe('valid arguments', () => {

				const VALUES = {
					id: [
						'urn:d2l:fra:id:some-id',
						'urn:d2l:fra:id:some.id',
						'urn:d2l:fra:id:some-id-2',
					],
					version: [ '0.0.0', '1.0.0-alpha.1' ],
					description: [
						'A simple description.',
						longString(1024)
					],
				};

				SIMPLE_PARAMETERS.forEach( (param) => {

					describe(param, () => {

						VALUES[param].forEach((value) => {

							it(value, () => {
								const opts = createValidOptsWithout(param);
								opts[param] = value;

								builder.build(opts, LOADER).metadata
									.should.have.property(param, value);
							});

						});
					});

				});

			});

			describe('invalid arguments', () => {

				const VALUES = {
					id: [ '....', '----', 'some--name', 'urn', 'urn:', 'urn:d2l:fra:id:some/id', 'urn:d2l:fra:id:some-id$' ],
					version: [ '....', '1.0-something', '1.0.0.1', '1.0', '1' ],
					description: [ longString(1025) ],
				};

				SIMPLE_PARAMETERS.forEach( (param) => {

					describe(param, () => {

						VALUES[param].forEach( (value) => {

							it(value, () => {
								const opts = createValidOptsWithout(param);
								opts[param] = value;

								expect( () => {
									builder.build(opts, LOADER);
								}).to.throw(new RegExp(param)); // message should include parameter name

							});

						});

					});
				});

			});

			describe('no value', () => {

				let stub;

				before( ()=> {
					stub = sinon
						.stub(require('../lib/packageJson'), 'read')
						.returns({});
				});

				after( () => {
					stub.restore();
				});

				['id','version','description'].forEach( (param) => {

					it(param, () => {
						const opts = createValidOptsWithout(param);

						expect( ()=> {
							builder.build(opts, LOADER);
						}).to.throw(param + ' was not specified and can\'t be found in package.json');

					});

				});

			});

		});

	});

});

function createValidOpts() {
	return {
		version: '1.0.0-alpha.1',
		description: 'It is a small world',
		id: 'urn:d2l:fra:id:some-id',
		loader: 'test'
	};
}

function createValidOptsWithout(str) {
	var opts = createValidOpts();
	delete opts[str];
	return opts;
}

function longString(len) {
	return Array(len + 1).join('a');
}
