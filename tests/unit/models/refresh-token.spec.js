describe("[Unit] Models: RefreshToken", function() {
  var proxyquire = require("proxyquire");
  var RefreshToken;
  var uuidStub;

  beforeEach(function() {
    uuidStub = {};
    RefreshToken = proxyquire("../../../models/refresh-token", {
      "node-uuid": uuidStub
    });
  });

  describe("Methods", function() {
    var refreshToken;

    beforeEach(function() {
      refreshToken = new RefreshToken();
    });

    describe("extendExpiration", function() {
      it("should extend the duration of the token expiration", function() {
        sandbox.stub(Date, "now").returns(5000);
        refreshToken.extendExpiration();
        expect(refreshToken.expiration.getTime()).to.equal(Date.now() + 604800000);
      });
    });

    describe("isExpired", function() {
      it("should return true if Date.now() is after the expiration date", function() {
        sandbox.stub(Date, "now").returns(5000);
        refreshToken.expiration = Date.now() - 1;
        expect(refreshToken.isExpired()).to.equal(true);
      });

      it("should return false if Date.now() is before the expiration date", function() {
        sandbox.stub(Date, "now").returns(5000);
        refreshToken.expiration = Date.now() + 1;
        expect(refreshToken.isExpired()).to.equal(false);
      });

      it("should return true if loggedOut exists", function() {
        sandbox.stub(Date, "now").returns(5000);
        refreshToken.expiration = Date.now() + 1; // token hasn't hit expiration time yet
        refreshToken.loggedOut = Date.now();

        var val = false;
        if (refreshToken.isExpired())
          val = true;
        
        expect(val).to.eql(true);
      });
    });

    describe("logout", function() {
      it("set the loggedOut time to Date.now()", function() {
        sandbox.stub(Date, "now").returns(5000);
        refreshToken.logout();
        expect(refreshToken.loggedOut.getTime()).to.equal(Date.now());
      });
    });
  });

  describe("Middleware", function() {
  });

  describe("Statics", function() {
    describe("create", function() {
      it("should create a new token on the first try", function() {
        var params = {
          user: { _id: "123" }
        };
        sandbox.stub(RefreshToken, "count").yields(null, 0);
        RefreshToken.create(params);

        expect(RefreshToken.count).to.have.been.calledOnce;
      });

      it("should call RefreshToken.count() a 2nd time if the first token was not unique", function() {
        var params = {
          user: { _id: "123" }
        };
        sandbox.stub(RefreshToken, "count").onFirstCall().yields(null, 1);
        RefreshToken.create(params);

        expect(RefreshToken.count).to.have.been.calledTwice;
      });
    });
  });
});
