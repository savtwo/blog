describe("[Unit] Models: User", function() {
  var bcryptStub;
  var proxyquire = require("proxyquire");
  var User;
  var uuidStub;

  beforeEach(function() {
    bcryptStub = {};
    uuidStub = {};
    User = proxyquire("../../../models/user", {
      "bcrypt-nodejs": bcryptStub,
      "node-uuid": uuidStub
    });
  });

  describe("Methods", function() {
    var user;

    beforeEach(function() {
      user = new User();
    });

    describe("clearPasswordResetToken", function() {
      it("should set password reset token and expiration to undefined", function() {
        user.passwordResetToken = "1234";
        user.passwordResetExpiration = 5000;
        user.clearPasswordResetToken();
        expect(user.passwordResetToken).to.be.undefined;
        expect(user.passwordResetExpiration).to.be.undefined;
      });
    });

    describe("generateEmailVerificationToken", function() {
      it("should generate a token and expiration", function() {
        var token = "1234-abcd";
        sandbox.stub(uuidStub, "v4").returns(token);
        user.generateEmailVerificationToken();
        expect(user.emailVerificationToken).to.equal(token);
      });
    });

    describe("generatePasswordResetToken", function() {
      it("should generate a token", function() {
        var token = "1234-abcd";
        sandbox.stub(Date, "now").returns(5000);
        sandbox.stub(uuidStub, "v4").returns(token);
        user.generatePasswordResetToken();
        expect(user.passwordResetToken).to.equal(token);
        expect(user.passwordResetExpiration.getTime()).to.equal(Date.now() + 604800000);
      });
    });

    describe("getClientSafe", function() {
      it("should return an object containing just ID and email", function() {
        user._id = "1234";
        user.email = "email";
        user.password = "password";
        user.passwordResetToken = "123";
        user.emailVerificationToken = "12345";
        expect(user.getClientSafe()).to.include.keys(["_id", "email"]);
        expect(user.getClientSafe()).to.not.include.keys(["password", "passwordResetToken", "emailVerificationToken"]);
      });
    });

    describe("hashPassword", function() {
      it("should hash the passed password and set it to the model", function() {
        var hashedPassword = "thisisahashedpassword";
        var password = "password";
        var salt = "passwordsalt";
        sandbox.stub(bcryptStub, "hashSync").returns(hashedPassword);
        sandbox.stub(bcryptStub, "genSaltSync").returns(salt);
        user.hashPassword(password);
        expect(bcryptStub.hashSync).to.have.been.calledWith(password, salt);
        expect(user.password).to.equal(hashedPassword);
      });
    });

    describe("isValidPassword", function() {
      it("should return true if the passed password matches", function() {
        var password = "password";
        user.hashPassword(password);
        expect(user.isValidPassword(password)).to.equal(true);
      });

      it("should return false if the passed password does not match", function() {
        var password = "password";
        user.hashPassword(password);
        expect(user.isValidPassword("password1")).to.equal(false);
      });

      it("should return false if the passed password is not a string", function() {
        var password = "password";
        user.hashPassword(password);
        expect(user.isValidPassword({})).to.equal(false);
        expect(user.isValidPassword([])).to.equal(false);
        expect(user.isValidPassword({ password: password })).to.equal(false);
        expect(user.isValidPassword([password])).to.equal(false);
        expect(user.isValidPassword(/password/)).to.equal(false);
        expect(user.isValidPassword(false)).to.equal(false);
      });
    });

    describe("isValidPasswordResetToken", function() {
      it("should return true if token matches and before expiration date", function() {
        var token = "1234";
        sandbox.stub(Date, "now").returns(5000);
        user.passwordResetToken = token;
        user.passwordResetExpiration = Date.now() + 1;
        expect(user.isValidPasswordResetToken(token)).to.equal(true);
      });

      it("should return false if token matches but is after expiration date", function() {
        var token = "1234";
        sandbox.stub(Date, "now").returns(5000);
        user.passwordResetToken = token;
        user.passwordResetExpiration = Date.now() - 1;
        expect(user.isValidPasswordResetToken(token)).to.equal(false);
      });

      it("should return false if token does not match", function() {
        var token = "1234";
        sandbox.stub(Date, "now").returns(5000);
        user.passwordResetToken = token;
        expect(user.isValidPasswordResetToken("123")).to.equal(false);
      });
    });

    describe("isVerified", function() {
      it("should return emailVerified value", function() {
        user.emailVerified = 5000;
        expect(user.isVerified().getTime()).to.equal(5000);
      });
    });

    describe("verifyEmail", function() {
      it("should set the emailVerified date to now", function() {
        sandbox.stub(Date, "now").returns(5000);
        user.verifyEmail();
        expect(user.emailVerified.getTime()).to.equal(5000);
      });
    });
  });

  describe("Middleware", function() {
    var user;

    beforeEach(function() {
      user = new User();
    });

    describe("_preSave", function() {
      it("should hash the password if it has been modified", function() {
        var hashSpy = sandbox.spy(user, "hashPassword");
        var password = "password";
        user.password = password;
        user._preSave(sinon.spy());
        expect(hashSpy).to.have.been.calledWith(password);
      });

      it("should not hash the password if it has not been modified", function() {
        var hashSpy = sandbox.spy(user, "hashPassword");
        user._preSave(sinon.spy());
        expect(hashSpy).to.not.have.been.called;
      });

      it("should set emailVerificationToken if it is new", function() {
        var tokenGenerateSpy = sandbox.spy(user, "generateEmailVerificationToken");
        user._preSave(sinon.spy());
        expect(tokenGenerateSpy).to.have.been.called;
      });

      it("should not set emailVerificationToken if it is not new", function() {
        var tokenGenerateSpy = sandbox.spy(user, "generateEmailVerificationToken");
        User.findOne({ email: "test@test.com" }, function(err, doc) {
          doc.emailVerified = Date.now();
          process.nextTick(function() {
            doc.save(function() {
              expect(tokenGenerateSpy).to.not.have.been.called;
            });
          });
        });
      });
    });
  });

  describe("Statics", function() {
  });
});
