var Promise = require("bluebird");
var DB      = require("../db/pgp.js");
var Redis   = require("ioredis");

var config  = require("../../config.js");
var util    = require("./test-util");

// Create database interfaces

// NB: using production database for now, but probably would be better to find a convenient way to test the entire stack using the test database
var redis = new Redis(config.redis.prod.URI);
var db    = new DB(config.pg.prod);

util.emptyDB(db)
.then(function() {
  console.log("All tuples deleted");
})
.then(function() {
  return util.deleteAllTokens(redis);
})
.then(function() {
  console.log("All tokens deleted");
})
.catch(function(err) {
  console.log("Error:", err.message);
})
.finally(function() {
  db.disconnect();
  redis.disconnect();
  process.exit();
});
