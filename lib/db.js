var Promise = require('bluebird');

// PG-PROMISE LIBRARY
// var pgp     = require('pg-promise')({ promiseLib: promise });

// MASSIVE LIBRARY
var massive = require('massive');

module.exports = function(PG_URI) {

// module.exports = function(login) {

  // var PG_URI = "postgres://" + login.USER + ":" + login.USER_PW + "@" + login.ADDRESS + "/" + login.DB;

  // var ADMIN_URI = "postgres://" + login.ADMIN_USER + ":" + login.ADMIN_PW + "@" + login.ADDRESS + "/" + login.DEFAULT_DB;

  // var pg; // database connection instance

  // var getInstance = function() {
  //   // Connect to Postgres via Massive
  //   try {
  //     var pg = massive.connectSync({connectionString: PG_URI});
  //   } catch (err) {
  //     console.log(err.code);
  //     // log in as admin
  //     pg_admin = massive.connectSync({connectionString: ADMIN_URI});
  //     if (err.code == "3D000") {
  //       console.log("first");
  //       // Postgres database not found, so create it
  //       pg_admin.runSync("CREATE DATABASE " + login.DB + " OWNER " + login.USER + " TEMPLATE " + login.DB_TEMPLATE + ";");
  //       // TO DO : Set up database
  //     } else if (err.code == '28000') {
  //       console.log("second");
  //       // Postgres user not found, so create it
  //       pg_admin.runSync("CREATE USER " + login.USER + " PASSWORD \'" + login.USER_PW + "\';");
  //     } else throw err;
  //     pg_admin.end();
  //     // try again
  //     pg = getInstance();
  //   }
  //   return pg;
  // }

  // var pg = getInstance();

  var pg = massive.connectSync({connectionString: PG_URI});

  // Add Promise interface
  pg.runAsync = Promise.promisify(pg.run);
  pg.api   = Promise.promisifyAll(pg.api);
  pg.admin = Promise.promisifyAll(pg.admin);

  // pg.admin.databaseSetup();

  // console.log("db.js : pg.scriptsDir =", pg.scriptsDir);


  var obj = {

    createDBUser: function(user, password) {
      return pg.runAsync("CREATE USER " + user + " PASSWORD \'" + password + "\';");
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
    checkoutBook: function(requesterid, copyid) {
      return pg.runAsync("BEGIN;")
        .then(pg.api.deleteBookRequestAsync.bind(null, [requesterid, copyid]))
        .then(pg.api.createBorrowingAsync.bind(null, [requesterid, copyid]))
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
