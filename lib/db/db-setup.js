var DB = require("./pgp.js");
var config = require("../../config.js");

// production database config
var prod  = config.pg.prod;

// get admin connection instance
var pg_admin = new DB(config.pg.admin);

// will hold connection instance to new database once created
var pg;

// create database user
pg_admin.createDBUser(prod.user, prod.password)
.then(function() {
  console.log("Successfully created database user:", prod.user);
  // create database
  return pg_admin.createDatabase(prod.database, prod.user, config.pg.template);
})
.then(function() {
  console.log("Successfully created database:", prod.database);
  pg_admin.disconnect();
  // connect to new database with new user and set up the schema
  pg = new DB(prod);
  return pg.setupDatabase();
})
.then(function() {
  console.log("Database configuration complete.");
  pg.disconnect();
})
.catch(function(err) {
  console.log("Error:", err.message);
})
.finally(function() {
  process.exit();
});
