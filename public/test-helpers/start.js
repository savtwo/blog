/* eslint no-undef: 0 */

var sandbox;

/**
 * Create a sinon sandbox for every test, and assign it to global for easy use.
 */
beforeEach(function() {
  sandbox = sinon.sandbox.create();
});

/**
 * Restore sinon sandbox after each test.
 */
afterEach(function() {
  sandbox.restore();
  window.localStorage.clear();
  window.sessionStorage.clear();
});
