var Promise = require("bluebird");
var DB = require("../db/pgp.js");
var config = require("../../config.js");
var util = require("./test-util");

// using production database for now, but probably would be better to find a convenient way to test the entire stack using the test database
var db = new DB(config.pg.prod);

util.emptyDB(db)
.then(function() {
  console.log("All tuples deleted");
})
.catch(function(err) {
  console.log("Error:", err.message);
})
.finally(function() {
  db.disconnect();
  process.exit();
});
