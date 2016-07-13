describe("[Unit] Handlers: Error", function() {
  var err;
  var ErrorHandler;
  var next;
  var proxyquire = require("proxyquire");
  var req;
  var res;
  
  beforeEach(function() {
    err = {};
    next = sinon.spy();
    req = {};
    res = {};
    ErrorHandler = proxyquire("../../../../routes/v0/error", {});
  });

  describe("Routes", function() {
    describe("noRoute", function() {
      it("should return a status 404", function() {
        res.status = sandbox.stub().returns(res);
        res.end = sandbox.spy();
        ErrorHandler.noRoute(req, res);
        expect(res.status).to.have.been.calledWith(404);
        expect(res.end).to.have.been.calledOnce;
      });
    });
    
    describe("routeError", function() {
      it("should return a status 400 with first error message from errors array", function() {
        err.errors = [new Error("Error1"), new Error("Error2")];
        res.status = sandbox.stub().returns(res);
        res.json = sandbox.spy();
        ErrorHandler.routeError(err, req, res, next);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledOnce;
      });
      
      it("should return a status 400 with error message", function() {
        var errMsg = "error message";
        err = new Error(errMsg);
        res.status = sandbox.stub().returns(res);
        res.json = sandbox.spy();
        ErrorHandler.routeError(err, req, res, next);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledOnce;
      });
    });
  });
});
