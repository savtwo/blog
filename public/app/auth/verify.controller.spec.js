/* eslint no-undef: 0 */

describe("[Controllers] VerifyCtrl", function() {
  var controller;
  var mockVerification = mockData.getMockVerification();
  
  beforeEach(function() {
    bard.appModule("app.auth");
    bard.inject("$controller", "$q", "$rootScope", "authService");
  });

  beforeEach(function() {
    controller = $controller("VerifyCtrl", { verification: mockVerification });
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  it("should exist", function() {
    expect(controller).to.exist;
  });
  
  describe("resend", function() {
    it("should call authService resend with an e-mail", function() {
      sandbox.stub(authService, "resend").returns($q.when({}));
      controller.email = "test@email.com";
      controller.resend();
      expect(authService.resend).to.have.been.calledWith(controller.email);
    });
  });
});
