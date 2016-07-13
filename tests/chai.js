var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.config.includeStack = true;

global.expect = chai.expect;
global.sinon = sinon;

/**
 * Create a sinon sandbox for every test, and assign it to global for easy use.
 */
beforeEach(function() {
  global.sandbox = sinon.sandbox.create();
});

/**
 * Restore sinon sandbox after each test.
 */
afterEach(function() {
  global.sandbox.restore();
});
