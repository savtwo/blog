exports.getUrl = getUrl;

/**
 * Parse a request and return the full host URL
 */
function getUrl(req) {
  return req.protocol + "://" + req.get("host");
}
