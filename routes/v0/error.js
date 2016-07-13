exports.noRoute = noRoute;
exports.routeError = routeError;

/**
 * Catch-all 404 no route found
 */
function noRoute(req, res) {
  return res.status(404).end();
}

/**
 * Catch-all error route. Returns an appropriate error based on what was caught
 */
function routeError(err, req, res, next) {
  /**
   * Mongoose errors
   */
  if (err.errors) {
    var errorKeys = Object.keys(err.errors);
    return res.status(400).json({
      message: err.errors[errorKeys[0]].message
    });
  }
  
  /**
   * Regular error, generated with new Error("error text");
   */
  if (err.message)
    return res.status(400).json({
      message: err.message
    });
  
  /**
   * Catch-all, could not determine error type or source
   */
  return res.status(500).json({
    message: "Something went wrong"
  });
}
