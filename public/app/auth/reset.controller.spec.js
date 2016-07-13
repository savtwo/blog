/* eslint no-undef: 0 */

describe("[Controllers] ResetCtrl", function() {
  var controller;
  
  beforeEach(function() {
    bard.appModule("app.auth");
    module("mockState");
    bard.inject("$controller", "$q", "$state", "$stateParams", "$rootScope", "authService");
  });

  beforeEach(function() {
    $stateParams.email = "test@email.com";
    $stateParams.token = "token";
    controller = $controller("ResetCtrl", { $stateParams: $stateParams });
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  it("should exist", function() {
    expect(controller).to.exist;
  });
  
  describe("change", function() {
    it("should call authService change with correct params", function() {
      var password = "passWord";
      sandbox.stub(authService, "change").returns($q.defer().promise);
      controller.change(password);
      expect(authService.change).to.have.been.calledWith($stateParams.email, $stateParams.token, password);
    });
    
    it("should go to login state if change returns success", function() {
      sandbox.stub(authService, "change").returns($q.when({}));
      $state.expectTransitionTo("login");
      controller.change("pw");
    });
    
    it("should go to login state if change returns success", function() {
      sandbox.stub(authService, "change").returns($q.reject({}));
      $state.expectTransitionTo("login");
      controller.change("pw");
    });
  });
});
