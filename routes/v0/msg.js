var RefreshToken = require("../../models/refresh-token");

exports.random = random;
exports.random2 = random2;

/**
 * Display a random message
 */
function random(req, res) {
  return res.status(200).json({
    message: "A random message"
  });
}

/**
 * Random unauthenticated endpoint
 */
function random2(req, res) {
  RefreshToken.create(function(err, token) {
    return res.json(token);
  });
}
