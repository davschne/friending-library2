var Promise = require("bluebird");
var DB = require("../db/pgp.js");
var config = require("../../config.js");
var util = require("./test-util");

var db = new DB(config.pg.prod);

// delete all borrowing
util.deleteAllBorrowing(db)
// delete all book requests
.then(util.deleteAllBookRequests.bind(util, db))
// delete all copies
.then(util.deleteAllCopies.bind(util, db))
// delete all books
.then(util.deleteAllBooks.bind(util, db))
// delete all users
.then(util.deleteAllUsers.bind(util, db))
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
