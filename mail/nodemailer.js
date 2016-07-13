var nodemailer = require("nodemailer");
var sendgrid = require("nodemailer-sendgrid-transport");

var apikey = {
  "development": process.env.SENDGRID_DEVELOPMENT,
  "test": process.env.SENDGRID_TEST,
  "production": process.env.SENDGRID_PRODUCTION
};

var transporter = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: apikey[process.env.NODE_ENV]
  }
}), {
  from: "do-not-reply@noogy.io"
});

module.exports = transporter;
