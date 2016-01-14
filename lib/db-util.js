var Promise = require('bluebird');

// PG-PROMISE LIBRARY
// var pgp     = require('pg-promise')({ promiseLib: promise });

// MASSIVE LIBRARY
var massive = require('massive');

module.exports = {
  getInstance: function(PG_URI) {
    // Add Promise interface
    var instance = massive.connectSync({connectionString: PG_URI});
    instance.runAsync = Promise.promisify(instance.run);
    instance.api   = Promise.promisifyAll(instance.api);
    instance.admin = Promise.promisifyAll(instance.admin);
    return instance;
    // return pgp(PG_URI);
  },
  disconnect: function() {
    // pgp.end();
  },
  createDBUser: function(pg, user, password) {
    return pg.runAsync("CREATE USER " + user + " password \'" + password + "\';");
  },
  createDatabase: function(pg, database, owner, template) {
    return pg.runAsync("CREATE DATABASE " + database + " OWNER " + owner + " TEMPLATE " + template + ";");
  },
  setupDatabase: function(pg) {
    return pg.admin.databaseSetupAsync();
  },
  dropDatabase: function(pg, database) {
    return pg.runAsync("DROP DATABASE " + database + ";");
  },
  dropDBUser: function(pg, user) {
    return pg.runAsync("DROP ROLE " + user + ";");
  },
  findOrCreateUser: function(pg, uid, displayName) {
    // return pg.query({
    //   name: "find-or-create-user",
    //   text: "INSERT INTO Users (uID, display_name) " +
    //         "SELECT $1, $2 " +
    //         "WHERE NOT EXISTS ( " +
    //           "SELECT uID " +
    //           "FROM Users " +
    //           "WHERE uID = $1 " +
    //         ")",
    //   values: [id, displayName]
    // });
    return pg.api.findOrCreateUserAsync([uid, displayName]);
  },
  deleteUser: function(pg, uid) {
    return pg.api.deleteUserAsync(uid);
  }
};
