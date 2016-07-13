/* eslint no-undef: 0 */

describe("[Services] authService", function() {
  beforeEach(function() {
    bard.appModule("app.auth");
    module("mockState");
    bard.inject("$httpBackend", "$q", "$state", "$rootScope", "api", "authService", "userService");
  });

  bard.verifyNoOutstandingHttpRequests();

  it("should exist", function() {
    expect(authService).to.exist;
  });
  
  describe("change", function() {
    it("should call change API and return promise", function() {
      var data = {
        email: "email",
        token: "token",
        password: "password"
      };
      $httpBackend.expectPOST(api.auth + "/change", data).respond(200);
      var r = authService.change(data.email, data.token, data.password);
      expect(r).to.eql($q.defer().promise);
      $httpBackend.flush();
    });
  });
  
  describe("forgot", function() {
    it("should call forgot API and return promise", function() {
      var data = {
        email: "email"
      };
      $httpBackend.expectPOST(api.auth + "/forgot", data).respond(200);
      var r = authService.forgot(data.email);
      expect(r).to.eql($q.defer().promise);
      $httpBackend.flush();
    });
  });
  
  describe("login", function() {
    var data;

    beforeEach(function() {
      data = {
        email: "email",
        password: "password"
      };
      sandbox.stub(userService, "setRefreshToken");
      sandbox.stub(userService, "setAccessToken");
    });

    it("should call login API and return promise", function() {
      $httpBackend.expectPOST(api.auth + "/login", data).respond(200, {});
      var r = authService.login(data.email, data.password);
      expect(r).to.eql($q.defer().promise);
      $httpBackend.flush();
    });

    it("should set refresh and access tokens if successful", function() {
      var response = {
        accessToken: "access.token",
        refreshToken: "refresh.token"
      };
      $httpBackend.whenPOST(api.auth + "/login").respond(200, response);
      authService.login(data.email, data.password);
      $httpBackend.flush();
      expect(userService.setRefreshToken).to.have.been.calledWith(response.refreshToken);
      expect(userService.setAccessToken).to.have.been.calledWith(response.accessToken);
    });

    it("should not set tokens if response status is failure", function() {
      $httpBackend.whenPOST(api.auth + "/login", data).respond(400);
      authService.login(data.email, data.password);
      $httpBackend.flush();
      expect(userService.setRefreshToken).to.not.have.been.called;
      expect(userService.setAccessToken).to.not.have.been.called;
    });
  });
  
  describe("logout", function() {
    beforeEach(function() {
      sandbox.stub(userService, "getRefreshToken");
      sandbox.stub(userService, "destroyTokens");
    });
    
    it("should call logout API and return promise", function() {
      $httpBackend.expectPOST(api.auth + "/logout", undefined).respond(200, {});
      var r = authService.logout();
      expect(r).to.eql($q.defer().promise);
      $httpBackend.flush();
    });

    it("should destroy tokens and go to state if specified, and response is success", function() {
      var toState = "somestate";
      var toParams = { params: "test" };
      $httpBackend.expectPOST(api.auth + "/logout", undefined).respond(200, {});
      authService.logout(toState, toParams);
      $state.expectTransitionTo(toState, toParams);
      $httpBackend.flush();
      expect(userService.destroyTokens).to.have.been.called;
    });

    it("should not destroy tokens or transition to state if response is failure", function() {
      $httpBackend.expectPOST(api.auth + "/logout", undefined).respond(400);
      authService.logout();
      $httpBackend.flush();
      expect(userService.destroyTokens).to.not.have.been.called;
    });
  });
  
  describe("refresh", function() {
    var response = {
      accessToken: "access.token"
    };

    beforeEach(function() {
      sandbox.stub(userService, "setAccessToken");
    });

    it("should call refresh API and return promise", function() {
      $httpBackend.expectPOST(api.auth + "/refresh", undefined).respond(200, {});
      var r = authService.refresh();
      expect(r).to.eql($q.defer().promise);
      $httpBackend.flush();
    });

    it("should set the access token if response is success", function() {
      $httpBackend.expectPOST(api.auth + "/refresh", undefined).respond(200, response);
      authService.refresh();
      $httpBackend.flush();
      expect(userService.setAccessToken).to.have.been.calledWith(response.accessToken);
    });

    it("should destroy all tokens if the response is a failure", function() {
      sandbox.stub(userService, "destroyTokens");
      $httpBackend.expectPOST(api.auth + "/refresh", undefined).respond(400);
      authService.refresh();
      $httpBackend.flush();
      expect(userService.destroyTokens).to.have.been.called;
    });

    it("should not destroy tokens if response status is -1", function() {
      sandbox.stub(userService, "destroyTokens");
      $httpBackend.expectPOST(api.auth + "/refresh", undefined).respond(-1);
      authService.refresh();
      $httpBackend.flush();
      expect(userService.destroyTokens).to.not.have.been.called;
    });
  });
  
  describe("register", function() {
    it("should call register API and return promise", function() {
      var data = {
        email: "email",
        password: "password"
      };
      $httpBackend.expectPOST(api.auth + "/register", data).respond(200);
      var r = authService.register(data.email, data.password);
      expect(r).to.eql($q.defer().promise);
      $httpBackend.flush();
    });
  });
  
  describe("resend", function() {
    it("should call resend API and return promise", function() {
      var data = {
        email: "email"
      };
      $httpBackend.expectPOST(api.auth + "/resend", data).respond(200);
      var r = authService.resend(data.email);
      expect(r).to.eql($q.defer().promise);
      $httpBackend.flush();
    });
  });
  
  describe("verify", function() {
    it("should call verify API and return promise", function() {
      var data = {
        email: "email",
        token: "token"
      };
      $httpBackend.expectPOST(api.auth + "/verify", data).respond(200);
      var r = authService.verify(data.email, data.token);
      expect(r).to.eql($q.defer().promise);
      $httpBackend.flush();
    });
  });
});
