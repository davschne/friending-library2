var Promise = require('bluebird');

// PG-PROMISE LIBRARY
// var pgp     = require('pg-promise')({ promiseLib: promise });

// MASSIVE LIBRARY
var massive = require('massive');

module.exports = function(PG_URI) {

  // Connect to Postgres via Massive
  var pg = massive.connectSync({connectionString: PG_URI});
  // console.log("db.js : pg.scriptsDir =", pg.scriptsDir);
  // Add Promise interface
  pg.runAsync = Promise.promisify(pg.run);
  pg.api   = Promise.promisifyAll(pg.api);
  pg.admin = Promise.promisifyAll(pg.admin);

  var obj = {

    createDBUser: function(user, password) {
      return pg.runAsync("CREATE USER " + user + " password \'" + password + "\';");
    },
    createDatabase: function(database, owner, template) {
      return pg.runAsync("CREATE DATABASE " + database + " OWNER " + owner + " TEMPLATE " + template + ";");
    },
    setupDatabase: function() {
      return pg.admin.databaseSetupAsync();
    },
    dropDatabase: function(database) {
      return pg.runAsync("DROP DATABASE " + database + ";");
    },
    dropDBUser: function(user) {
      return pg.runAsync("DROP ROLE " + user + ";");
    },
    findOrCreateUser: function(uid, displayName) {
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
    deleteUser: function(uid) {
      return pg.api.deleteUserAsync(uid);
    },
    createCopy: function(uid, ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall) {
      var resObj;
      return pg.runAsync("BEGIN;")
        .then(pg.api.createBookAsync.bind(null, [ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall]))
        .then(pg.api.createCopyAsync.bind(null, [ISBN, uid]))
        .then(function(res) {
          resObj = res;
          return pg.runAsync("COMMIT;");
        })
        .then(function() {
          return resObj;
        });
    },
    deleteCopy: function(copyid) {
      return pg.api.deleteCopyAsync([copyid]);
    },
    getOwnBooks: function(uid) {
      return pg.api.getOwnBooksAsync([uid]);
    },
    createBookRequest: function(uid, copyid) {
      return pg.api.createBookRequestAsync([uid, copyid]);
    },
    deleteBookRequest: function(uid, copyid) {
      return pg.api.deleteBookRequestAsync([uid, copyid]);
    },
    checkoutBook: function(borrowerid, copyid) {
      return pg.runAsync("BEGIN;")
        .then(pg.api.deleteBookRequestAsync.bind(null, [borrowerid, copyid]))
        .then(pg.api.createBorrowingAsync.bind(null, [borrowerid, copyid]))
        .then(pg.runAsync.bind(pg, "COMMIT;"));
    },
    checkinBook: function(borrowerid, copyid) {
      return pg.api.deleteBorrowingAsync([borrowerid, copyid]);
    },
    getIncomingBookRequests: function(uid) {
      return pg.api.getIncomingBookRequestsAsync([uid]);
    },
    getOutgoingBookRequests: function(uid) {
      return pg.api.getOutgoingBookRequestsAsync([uid]);
    },
    getLentBooks: function(uid) {
      return pg.api.getLentBooksAsync(uid);
    },
    getBorrowedBooks: function(uid) {
      return pg.api.getBorrowedBooksAsync(uid);
    },
    getAvailableBooks: function(uid) {
      return pg.api.getAvailableBooksAsync(uid);
    }
  };

  obj.run = pg.runAsync.bind(pg);
  obj.disconnect = pg.end.bind(pg);

  return obj;
};
