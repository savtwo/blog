"use strict";

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var compression = require("compression");
var express = require("express");
var favicon = require("serve-favicon");
var mongoose = require("mongoose");
var morgan = require("morgan");
var path = require("path");
var request = require("request");

var app = express();

/**
 * Database configuration
 */
// mongoose.connect(process.env.DB_CONNECTION);

/**
 * Express configuration
 */
app.use(morgan("dev"));
app.use(compression());
app.use(favicon(path.join(__dirname, "public/img/favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * API routes
 */
var api = {
  v0: require("./routes/v0/_v0")
};
app.use("/api/v0", api.v0);

/**
 * SPA route
 */
app.get("*", function(req, res) {
  var options = {
    root: __dirname + "/public/dist"
  };
  
  res.sendFile("index.html", options);
});

app.listen(process.env.PORT || 4000);
