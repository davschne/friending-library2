var Promise = require('bluebird');

// PG-PROMISE LIBRARY
// var pgp     = require('pg-promise')({ promiseLib: promise });

// MASSIVE LIBRARY
var massive = require('massive');

module.exports = {
  getInstance: function(PG_URI) {
    // Add Promise interface
    var instance = Promise.promisifyAll(massive.connectSync({connectionString: PG_URI}));
    instance.admin = Promise.promisifyAll(instance.admin);
    return instance;
    // return pgp(PG_URI);
  },
  disconnect: function() {
    // pgp.end();
  },
  findOrCreateUser: function(pg, id, displayName) {
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
    return pg.findOrCreateUserAsync(id, displayName);
  },
  createOwnerAndDatabase: function(pg, owner, password, database, template) {
    return pg.admin.databaseCreationAsync(owner, password, database, template);
  },
  setupDatabase: function(pg) {
    return pg.admin.databaseSetupAsync();
  },
  dropDatabaseAndOwner: function(pg, database, owner) {
    return pg.admin.databaseDropAsync(database, owner);
  }
};
