"use strict";

var bodyParser = require("body-parser");
var express = require("express");
var morgan = require("morgan");
var path = require("path");

var app = express();

/**
 * Express configuration
 */
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/**
 * GET /
 */
app.get("/", function(req, res) {
  // var options = {
  //   root: __dirname + "/public"
  // };
  
  res.sendFile("index.html");
});

app.listen(process.env.PORT || 4000);
