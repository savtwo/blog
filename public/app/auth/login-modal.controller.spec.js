/* eslint no-undef: 0 */

describe("[Controllers] LoginModalCtrl", function() {
  var controller;
  var mockMessageParams = mockData.getMockMessageParams();
  var mockModalInstance = mockData.getMockModalInstance();
  
  beforeEach(function() {
    bard.appModule("app.auth");
    module("mockState");
    bard.inject("$controller", "$q", "$state", "$rootScope", "authService");
  });

  beforeEach(function() {
    controller = $controller("LoginModalCtrl", { $uibModalInstance: mockModalInstance, params: mockMessageParams });
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  it("should exist", function() {
    expect(controller).to.exist;
  });
  
  describe("forgot", function() {
    it("should call authService forgot with correct params", function() {
      var email = "test@email.com";
      sandbox.stub(authService, "forgot").returns($q.defer().promise);
      controller.forgot(email);
      expect(authService.forgot).to.have.been.calledWith(email);
    });
  });
  
  describe("login", function() {
    it("should call authService login with correct params", function() {
      var email = "test@email.com";
      var password = "passWord";
      sandbox.stub(authService, "login").returns($q.defer().promise);
      controller.login(email, password);
      expect(authService.login).to.have.been.calledWith(email, password);
    });
    
    it("should close the modal instance if login succeeds", function() {
      sandbox.spy(mockModalInstance, "close");
      sandbox.stub(authService, "login").returns($q.when({}));
      controller.login("email", "pw");
      $rootScope.$apply();
      expect(mockModalInstance.close).to.have.been.called;
    });
    
    it("should dismiss the modal instance and transition to /verify if login fails with 403", function() {
      var email = "test@email.com";
      sandbox.spy(mockModalInstance, "dismiss");
      sandbox.stub(authService, "login").returns($q.reject({ status: 403 }));
      $state.expectTransitionTo("verify", { email: email });
      controller.login(email, "pw");
      $rootScope.$apply();
      expect(mockModalInstance.dismiss).to.have.been.called;
    });
  });
  
  describe("register", function() {
    it("should call authService register with correct params", function() {
      var email = "test@email.com";
      var password = "passWord";
      sandbox.stub(authService, "register").returns($q.defer().promise);
      controller.register(email, password);
      expect(authService.register).to.have.been.calledWith(email, password);
    });
  });
});
