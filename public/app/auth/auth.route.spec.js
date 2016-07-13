/* eslint no-undef: 0 */

describe("[Routes] auth", function() {
  var views = {
    reset: "app/auth/reset.html",
    verify: "app/auth/verify.html"
  };

  beforeEach(function() {
    module("app.auth");
    module("mh.templates");
    bard.inject("$q", "$rootScope", "$state", "$timeout", "authService", "loginModalService");
  });

  bard.verifyNoOutstandingHttpRequests();

  describe("login", function() {
    it("should map login state to url /login", function() {
      expect($state.href("login", {})).to.equal("/login");
    });
  });

  describe("reset", function() {
    it("should map reset state to url /reset", function() {
      expect($state.href("reset", {})).to.equal("/reset");
    });

    it("should map reset route to reset view template", function() {
      expect($state.get("reset").templateUrl).to.equal(views.reset);
    });

    it("should have $state.go route to reset", function() {
      $state.go("reset");
      $rootScope.$apply();
      expect($state.is("reset")).to.be.true;
    });
  });

  describe("verify", function() {
    it("should map verify state to url /verify", function() {
      expect($state.href("verify", {})).to.equal("/verify");
    });

    it("should map verify route to verify view template", function() {
      expect($state.get("verify").templateUrl).to.equal(views.verify);
    });

    it("should have $state.go route to verify", function() {
      $state.go("verify");
      $rootScope.$apply();
      expect($state.is("verify")).to.be.true;
    });

    it("should call authService verify and route to login if e-mail and token exist on route", function() {
      sandbox.stub(authService, "verify").returns($q.when({}));
      $state.go("verify", { email: "email", token: "token" });
      expect(authService.verify).to.have.been.calledOnce.calledWith("email", "token");
      sandbox.stub($state, "go");
      $timeout.flush();
      expect($state.go).to.have.been.calledOnce.calledWith("login");
    });

    it("should not call authService verify if e-mail does not exist", function() {
      sandbox.stub(authService, "verify").returns($q.when({}));
      $state.go("verify", { email: "email" });
      expect(authService.verify).to.not.have.been.called;
    });

    it("should not call authService verify if token does not exist", function() {
      sandbox.stub(authService, "verify").returns($q.when({}));
      $state.go("verify", { token: "token" });
      expect(authService.verify).to.not.have.been.called;
    });
  });
});
