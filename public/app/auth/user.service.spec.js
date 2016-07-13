/* eslint no-undef: 0 */

describe("[Services] userService", function() {
  var mockAccessToken = mockData.getMockAccessToken();

  beforeEach(function() {
    bard.appModule("app.auth");
    bard.inject("$q", "$rootScope", "$window", "userService");
  });

  bard.verifyNoOutstandingHttpRequests();

  it("should exist", function() {
    expect(userService).to.exist;
  });
  
  describe("accessTokenIsExpired", function() {
    it("should return true if no access token exists", function() {
      sandbox.stub(userService, "getAccessToken").returns(undefined);
      expect(userService.accessTokenIsExpired()).to.be.true;
    });

    it("should return true if access token is expired or within 30s of expiration", function() {
      sandbox.stub(userService, "getAccessToken").returns(mockAccessToken.token);
      sandbox.stub(Date, "now").returns(1467906608000); // 30 seconds before expiration
      expect(userService.accessTokenIsExpired()).to.be.true;
    });
    
    it("should return false if access token is not expired", function() {
      sandbox.stub(userService, "getAccessToken").returns(mockAccessToken.token);
      sandbox.stub(Date, "now").returns(1467906607999); // 30.001 seconds before expiration
      expect(userService.accessTokenIsExpired()).to.be.false;
    });
  });
  
  describe("destroyTokens", function() {
    it("should set user to undefined, and delete local storage token keys", function() {
      userService.user = { user: "user" };
      $window.localStorage.accessToken = "token";
      $window.localStorage.refreshToken = "token";
      userService.destroyTokens();
      expect(userService.user).to.be.undefined;
      expect($window.localStorage.accessToken).to.not.exist;
      expect($window.localStorage.refreshToken).to.not.exist;
    });
  });
  
  describe("getAccessToken", function() {
    it("should return the access token from storage", function() {
      var accessToken = "accessToken";
      $window.localStorage.accessToken = accessToken;
      expect(userService.getAccessToken()).to.equal(accessToken);
      $window.localStorage.removeItem("accessToken");
    });
  });
  
  describe("getRefreshToken", function() {
    it("should return the refresh token from storage", function() {
      var refreshToken = "refreshToken";
      $window.localStorage.refreshToken = refreshToken;
      expect(userService.getRefreshToken()).to.equal(refreshToken);
      $window.localStorage.removeItem("refreshToken");
    });
  });
  
  describe("refreshUser", function() {
    it("should set user object to the passed access token", function() {
      var user = userService.refreshUser(mockAccessToken.token);
      expect(userService.user).to.eql(mockAccessToken.decoded);
      expect(user).to.eql(mockAccessToken.decoded);
    });

    it("should set the user object to the stored access token if none is passed", function() {
      sandbox.stub(userService, "getAccessToken").returns(mockAccessToken.token);
      var user = userService.refreshUser();
      expect(userService.user).to.eql(mockAccessToken.decoded);
      expect(user).to.eql(mockAccessToken.decoded);
    });

    it("should return undefined if no access token could be found", function() {
      sandbox.stub(userService, "getAccessToken").returns(undefined);
      var user = userService.refreshUser();
      expect(userService.user).to.be.undefined;
      expect(user).to.be.undefined;
    });
  });
  
  describe("setAccessToken", function() {
    it("should add the passed access token to local storage and set the user", function() {
      var token = mockAccessToken.token;
      sandbox.spy($window.localStorage, "setItem");
      var at = userService.setAccessToken(token);
      expect($window.localStorage.setItem).to.have.been.calledWith("accessToken", token);
      expect(userService.user).to.eql(mockAccessToken.decoded);
      expect(at).to.equal(token);
    });
  });
  
  describe("setRefreshToken", function() {
    it("should add the passed refresh token to local storage", function() {
      var token = "refreshtoken";
      sandbox.spy($window.localStorage, "setItem");
      var rt = userService.setRefreshToken(token);
      expect($window.localStorage.setItem).to.have.been.calledWith("refreshToken", token);
      expect(rt).to.equal(token);
    });
  });
});
