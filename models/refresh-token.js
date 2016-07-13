var async = require("async");
var mongoose = require("mongoose");
var uuid = require("node-uuid");

var refreshTokenSchema = new mongoose.Schema({
  expiration: {
    type: Date,
    required: true
  },
  loggedOut: {
    type: Date
  },
  token: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

refreshTokenSchema.methods.extendExpiration = extendExpiration;
refreshTokenSchema.methods.isExpired = isExpired;
refreshTokenSchema.methods.logout = logout;
refreshTokenSchema.statics.create = create;

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);

/**
 * Generate a new refresh token.
 *
 * @param cb callback returns new refresh token.
 */
function create(params, cb) {
  var self = this;
  var unique = false;
  
  /* Ensure that the token is unique before saving it */
  async.whilst(
    function() {
      return !unique;
    }, function(callback) {
      var token = uuid.v4();
      self.count({ token: token }, function(err, count) {
        if (count === 0)
          unique = true;
        
        callback(err, token);
      });
    }, function(err, token) {
      if (err)
        return cb(err);
      
      var newToken = new self;
      newToken.user = params.user._id;
      newToken.token = token;
      newToken.extendExpiration();
    
      newToken.save(function(err) {
        if (err)
          return cb(err);
        
        cb(null, newToken);
      });
    }
  );
}

/**
 * Extend the expiration date of the refresh token.
 * 604800000 = 1 week
 */
function extendExpiration() {
  return this.expiration = Date.now() + 604800000;
}

/**
 * Determine validness/expiration of refresh token
 *
 * @returns true if current datetime is beyond the expiration
 */
function isExpired() {
  return this.loggedOut || Date.now() > this.expiration;
}

/**
 * Force "logout" the refresh token.
 *
 * @returns Date.now() as logout time
 */
function logout() {
  return this.loggedOut = Date.now();
}
