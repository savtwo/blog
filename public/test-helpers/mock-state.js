/**
 * Mock for ui-router $state service
 * See this gist: https://gist.github.com/wilsonwc/8358542
 *
 * To use, add module("mockState"); in your beforeEach()
 * To test, call $state.expectTransitionTo(state, params); before your expected $state.go
 */
angular.module("mockState", []);
angular.module("mockState").service("$state", function($q) {
  this.ensureAllTransitionsHappened = ensureAllTransitionsHappened;
  this.expectedTransitions = [];
  this.expectTransitionTo = expectTransitionTo;
  this.go = transitionTo;
  this.transitionTo = transitionTo;
  
  function ensureAllTransitionsHappened() {
    if (this.expectedTransitions.length > 0)
      throw Error("Not all transitions happened!");
  }
  
  function expectTransitionTo(stateName, params) {
    this.expectedTransitions.push({ name: stateName, params: params });
  }
  
  function transitionTo(stateName, params) {
    if (this.expectedTransitions.length < 1)
      throw Error("No more transitions were expected! Tried to transition to " + stateName );
    
    var expectedState = this.expectedTransitions.shift();
    
    if (expectedState.name !== stateName)
      throw Error("Expected transition to state: " + expectedState.name + " but transitioned to " + stateName );
    
    if (expectedState.params && !angular.equals(expectedState.params, params))
      throw Error("Expected params for state " + stateName + " to be " + JSON.stringify(expectedState.params) + " but received " + JSON.stringify(params));
    
    return $q.when();
  }
});
