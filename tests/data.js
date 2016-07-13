var async = require("async");
var mongoose = require("mongoose");
var fixtureUsers = require("./fixtures/users");

process.env.DB_CONNECTION = "mongodb://localhost/test";

exports.connect = connect;
exports.dropDB = dropDB;
exports.loadFixtures = loadFixtures;

/**
 * Connect to the database
 */
before(function(done) {
  connect(done);
});

/**
 * Clear all mongoose models and schemas before each test.
 */
beforeEach(function(done) {
  dropDB(function() {
    loadFixtures([
      fixtureUsers
    ], done);
  });
});

afterEach(function() {
  mongoose.models = {};
  mongoose.modelSchemas = {};
});

/**
 * Disconenct from database.
 */
after(function(done) {
  mongoose.disconnect(done);
});

/**
 * Connect to the database
 */
function connect(done) {
  mongoose.connect(process.env.DB_CONNECTION, done);
}

/**
 * Drop all collections from the database
 */
function dropDB(done) {
  async.each(mongoose.connection.collections, function(collection, cb) {
    if (collection.collectionName.indexOf("system") === 0)
      return cb();
    
    collection.drop(cb);
  }, function(err) {
    done(err);
  });
}

/**
 * Load all fixtures by looping through the array of passed in fixtures, and inserting
 * any data from those fixtures into the appropriate model.
 * Use .insert to avoid all middleware hooks in mongoose - might not work, async??
 * Use model.create to go through all middleware hooks (much slower)
 */
function loadFixtures(fixtures, done) {
  async.each(fixtures, function(fixture, cb) {
    async.each(fixture.data, function(doc, cb2) {
      fixture.model.create(doc, cb2);
    }, function(err) {
      return cb();
    });
  }, function(err) {
    done(err);
  });
}
