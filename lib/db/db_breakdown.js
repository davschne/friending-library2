var DB = require("./pgp.js");
var login = require("../login.js");

// production database config
var prod  = login.pg.prod;

// get admin connection instance
var pg_admin = new DB(login.pg.admin);

// drop database
pg_admin.dropDatabase(login.pg.prod.database)
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
