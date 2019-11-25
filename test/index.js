const chai = require('chai');
const appConfigBuilder = require('../lib/index');

const expect = chai.expect;

describe('index', () => {

	it('should define appConfigBuilder', () => {
		expect(appConfigBuilder).to.be.a('Object');
	});

});
