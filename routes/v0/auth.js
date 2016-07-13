var async = require("async");
var jwt = require("jsonwebtoken");
var nodemailer = require("../../mail/nodemailer");
var RefreshToken = require("../../models/refresh-token");
var urlHelper = require("../../helpers/url");
var User = require("../../models/user");

exports.change = change;
exports.forgot = forgot;
exports.login = login;
exports.logout = logout;
exports.refresh = refresh;
exports.register = register;
exports.resendEmailToken = resendEmailToken;
exports.verifyEmailToken = verifyEmailToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;

/**
 * Change the account's password if the token is valid.
 */
function change(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var resetToken = req.body.token;

  if (!email || !password || !resetToken)
    return res.status(401).json({
      message: "Bad credentials"
    });
  
  async.waterfall([
    function(cb) {
      User.findOne({ email: email.toLowerCase(), passwordResetToken: resetToken }, cb);
    },
    function(user, cb) {
      if (!user)
        return res.status(401).json({
          message: "Bad credentials"
        });
      
      if (!user.isValidPasswordResetToken(resetToken))
        return res.status(401).json({
          message: "Bad credentials"
        });
      
      user.password = password;
      user.clearPasswordResetToken();
      user.save(cb);
    },
    function(user, count, cb) {
      RefreshToken.find({ user: user }).populate("user").exec(cb);

      return res.status(200).json({
        message: "Password changed"
      });
    },
    function(refreshTokens) {
      refreshTokens.forEach(function(token) {
        if (token.isExpired())
          return;
        
        token.logout();
        token.save();
      });
    }
  ], function(err) {
    return next(err);
  });
}

/**
 * Send an e-mail to the account with a generated password reset token.
 */
function forgot(req, res, next) {
  var email = req.body.email;

  if (!email)
    return res.status(401).json({
      message: "Bad credentials"
    });

  async.waterfall([
    function(cb) {
      User.findOne({ email: email.toLowerCase() }, cb);
    },
    function(user, cb) {
      if (!user)
        return res.status(401).json({
          message: "Bad credentials"
        });
      
      user.generatePasswordResetToken();
      user.save(cb);
    },
    function(user, cb) {
      nodemailer.sendMail({
        to: user.email,
        subject: "Noogy | Password reset",
        text: "Please verify your e-mail by clicking the following link: "
          + urlHelper.getUrl(req)
          + "/reset?token=" + user.passwordResetToken
          + "&email=" + user.email
      });

      return res.status(200).json({
        message: "Password reset sent"
      });
    }
  ], function(err) {
    return next(err);
  });
}

/**
 * Sign and respond with a JWT and refresh token if username and password matches
 */
function login(req, res, next) {
  var email = req.body.email;

  if (!email)
    return res.status(401).json({
      message: "Bad credentials"
    });
  
  async.waterfall([
    function(cb) {
      User.findOne({ email: email.toLowerCase() }, cb);
    },
    function(user, cb) {
      if (!user)
        return res.status(401).json({
          message: "Bad credentials"
        });
      
      if (!user.isValidPassword(req.body.password))
        return res.status(401).json({
          message: "Bad credentials"
        });
      
      if (!user.isVerified())
        return res.status(403).json({
          message: "Account not verified"
        });

      async.parallel([
        function(cb2) {
          jwt.sign(user.getClientSafe(), process.env.SESSION_SECRET_KEY, {
            expiresIn: 540  // 15 minutes
          }, cb2);
        }, function(cb2) {
          RefreshToken.create({ user: user }, function(err, refreshToken) {
            cb2(err, refreshToken.token);
          });
        }
      ], function(err, tokens) {
        if (err)
          return cb(err);
        
        return res.status(200).json({
          accessToken: tokens[0],
          refreshToken: tokens[1]
        });
      });
    }
  ], function(err) {
    return next(err);
  });
}

/**
 * Logout by invalidating the passed token.
 */
function logout(req, res, next) {
  var refreshToken = req.refreshToken;
  
  async.waterfall([
    function(cb) {
      refreshToken.logout();
      refreshToken.save(cb);
    },
    function() {
      return res.status(200).end();
    }
  ], function(err) {
    return next(err);
  });
}

/**
 * Issue a new access token using a refresh token. Also extend the refresh token.
 */
function refresh(req, res, next) {
  var refreshToken = req.refreshToken;
  
  async.waterfall([
    function(cb) {
      refreshToken.extendExpiration();
      refreshToken.save(cb);
    },
    function() {
      var accessToken = jwt.sign(refreshToken.user.getClientSafe(), process.env.SESSION_SECRET_KEY, {
        expiresIn: 540  // 15 minutes
      });
      
      return res.status(200).json({
        accessToken: accessToken
      });
    }
  ], function(err) {
    return next(err);
  });
}

/**
 * Register a new account. If successful, send an e-mail verification token to the registered e-mail.
 */
function register(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password)
    return res.status(401).json({
      message: "Bad credentials"
    });
  
  async.waterfall([
    function(cb) {
      User.findOne({ email: email.toLowerCase() }, cb);
    },
    function(user, cb) {
      if (user)
        return res.status(409).json({
          message: "E-mail already in use"
        });
      
      var newUser = new User({
        email: req.body.email,
        password: req.body.password
      });
      
      newUser.save(cb);
    },
    function(user, cb) {
      nodemailer.sendMail({
        to: user.email,
        subject: "Noogy | Account Registration",
        text: "Please verify your e-mail by clicking the following link: "
          + urlHelper.getUrl(req)
          + "/verify?token=" + user.emailVerificationToken
          + "&email=" + user.email
      });

      return res.status(200).json({
        message: user.email + " has been registered"
      });
    }
  ], function(err) {
    return next(err);
  });
}

/**
 * Resend the e-mail verification token to the specified e-mail.
 * Check if the account is verified first. If so, ignore the request.
 */
function resendEmailToken(req, res, next) {
  var email = req.query.email || req.body.email;

  if (!email)
    return res.status(401).json({
      message: "Bad credentials"
    });
  
  async.waterfall([
    function(cb) {
      User.findOne({ email: email.toLowerCase() }, cb);
    },
    function(user, cb) {
      if (!user)
        return res.status(401).json({
          message: "Bad credentials"
        });
      
      if (user.isVerified())
        return res.status(401).json({
          message: "Bad credentials"
        });

      nodemailer.sendMail({
        to: user.email,
        subject: "Noogy | Account Registration",
        text: "Please verify your e-mail by clicking the following link: "
          + urlHelper.getUrl(req)
          + "/verify?token=" + user.emailVerificationToken
          + "&email=" + user.email
      });
      
      return res.status(200).json({
        message: "Verification e-mail sent"
      });
    }
  ], function(err) {
    return next(err);
  });
}

/**
 * Checks if the incoming request contains an e-mail verification token after registration.
 * If valid, set the user as verified.
 */
function verifyEmailToken(req, res, next) {
  var email = req.query.email || req.body.email;
  var emailToken = req.query.token || req.body.token;

  if (!email || !emailToken)
    return res.status(401).json({
      message: "Bad credentials"
    });
  
  async.waterfall([
    function(cb) {
      User.findOne({ email: email.toLowerCase(), emailVerificationToken: emailToken }, cb);
    },
    function(user, cb) {
      if (!user)
        return res.status(401).json({
          message: "Bad credentials"
        });
      
      user.verifyEmail();
      user.save(cb);
    },
    function(user) {
      return res.status(200).json({
        message: user.email + " has been verified"
      });
    }
  ], function(err) {
    return next(err);
  });
}

/**
 * Middleware
 * Checks if the incoming request contains a valid access token.
 * If token is valid, send them to next function in route. If not, return 401.
 */
function verifyAccessToken(req, res, next) {
  var accessToken = req.body.accessToken || req.query.accessToken || req.headers["x-access-token"];
  
  if (!accessToken)
    return res.status(401).json({
      message: "Bad credentials"
    });
  
  async.waterfall([
    function(cb) {
      jwt.verify(accessToken, process.env.SESSION_SECRET_KEY, cb);
    },
    function(decoded) {
      req.accessToken = {
        encoded: accessToken,
        decoded: decoded
      };
      
      return next();
    }
  ], function(err) {
    return res.status(401).json({
      message: "Bad credentials"
    });
  });
}

/**
 * Middleware
 * Checks if the incoming request contains a valid refresh token.
 * If token is valid, send them to next function in route. If not, return 401.
 */
function verifyRefreshToken(req, res, next) {
  var refreshTokenStr = req.body.refreshToken || req.query.refreshToken || req.headers["x-refresh-token"];
  
  if (!refreshTokenStr)
    return res.status(401).json({
      message: "Bad credentials"
    });
  
  async.waterfall([
    function(cb) {
      RefreshToken
        .findOne({ token: refreshTokenStr })
        .populate("user")
        .exec(cb);
    },
    function(refreshToken) {
      if (!refreshToken || refreshToken.isExpired())
        return res.status(401).json({
          message: "Bad credentials"
        });
      
      req.refreshToken = refreshToken;
      return next();
    }
  ], function(err) {
    return next(err);
  });
}
