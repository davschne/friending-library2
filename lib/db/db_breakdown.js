var DB = require("./pgp.js");
var config = require("../../config.js");

// production database config
var prod  = config.pg.prod;

// get admin connection instance
var pg_admin = new DB(config.pg.admin);

// drop database
pg_admin.dropDatabase(config.pg.prod.database)
.then(function() {
  console.log("Successfully dropped database:", prod.database);
  // drop database user
  return pg_admin.dropDBUser(prod.user);
})
.then(function() {
  console.log("Successfully dropped user:", prod.user);
  console.log("Database breakdown complete.");
})
.catch(function(err) {
  console.log("Error:", err.message);
})
.finally(function() {
  pg_admin.disconnect();
  process.exit();
});
