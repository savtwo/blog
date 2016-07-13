var express = require("express");
var handlers = {
  auth: require("./auth"),
  error: require("./error"),
  msg: require("./msg")
};
var router = express.Router();

router.post("/auth/change", handlers.auth.change);
router.post("/auth/forgot", handlers.auth.forgot);
router.post("/auth/login", handlers.auth.login);
router.post("/auth/refresh", handlers.auth.verifyRefreshToken, handlers.auth.refresh);
router.post("/auth/register", handlers.auth.register);
router.post("/auth/resend", handlers.auth.resendEmailToken);
router.post("/auth/verify", handlers.auth.verifyEmailToken);
router.post("/auth/logout", handlers.auth.verifyRefreshToken, handlers.auth.logout);

router.get("/msg/random2", handlers.msg.random2);
router.use("/msg", handlers.auth.verifyAccessToken);
router.get("/msg/random", handlers.msg.random);

router.use(handlers.error.routeError);
router.use(handlers.error.noRoute);

module.exports = router;
