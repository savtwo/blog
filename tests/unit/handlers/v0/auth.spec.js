describe("[Unit] Handlers: Error", function() {
  var AuthHandler;
  var jwtStub;
  var next;
  var proxyquire = require("proxyquire");
  var req;
  var res;
  var userStub;

  beforeEach(function() {
    jwtStub = {};
    next = sinon.spy();
    req = {};
    res = {};
    userStub = {};
    AuthHandler = proxyquire("../../../../routes/v0/auth", {
      "jsonwebtoken": jwtStub,
      "../../models/user": userStub
    });
  });

  describe("Routes", function() {

  });

  describe("Middleware", function() {
    describe("verifyAccessToken", function() {
      it("should return a status 401 if no access token is sent", function() {
        req.body = {}, req.query = {}, req.headers = {};
        res.status = sandbox.stub().returns(res);
        res.json = sinon.spy();
        AuthHandler.verifyAccessToken(req, res, next);
        expect(res.status).to.have.been.calledWith(401);
        expect(res.json).to.have.been.calledOnce;
      });
    });

    describe("verifyRefreshToken", function() {
      it("should return a status 401 if no refresh token is sent", function() {
        req.body = {}, req.query = {}, req.headers = {};
        res.status = sandbox.stub().returns(res);
        res.json = sinon.spy();
        AuthHandler.verifyRefreshToken(req, res, next);
        expect(res.status).to.have.been.calledWith(401);
        expect(res.json).to.have.been.calledOnce;
      });
    });
  });
});
