var promise = require("bluebird");
var sql = require("./queries/load-sql-from-files");

var options = {
  promiseLib: promise,
  capTX: true
};

var pgp = require("pg-promise")(options);

var loadMethods = function(db) {

  db.createDBUser = function(user, password) {
    return db.query("CREATE USER " + user + " PASSWORD \'" + password + "\';");
  };

  db.createDatabase = function(database, owner, template) {
    return db.query("CREATE DATABASE " + database + " OWNER " + owner + " TEMPLATE " + template + ";");
  };

  db.setupDatabase = function() {
    return db.query(sql.setupDatabase);
  };

  db.dropDatabase = function(database) {
    return db.query("DROP DATABASE " + database + ";");
  };

  db.dropDBUser = function(user) {
    return db.query("DROP ROLE " + user + ";");
  };

  db.findOrCreateUser = function(uid, displayName) {
    return db.query(sql.findOrCreateUser, [id, displayName]);
  };

  db.deleteUser = function(uid) {
    return db.query(sql.deleteUser, [uid]);
  };

  db.createCopy = function(uid, ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall) {
    var resObj;
    return db.query("BEGIN;")
      .then(db.api.createBookAsync.bind(null, [ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall]))
      .then(db.api.createCopyAsync.bind(null, [ISBN, uid]))
      .then(function(res) {
        resObj = res;
        return db.query("COMMIT;");
      })
      .then(function() {
        return resObj;
      });
  };

  db.deleteCopy = function(copyid) {
    return db.api.deleteCopyAsync([copyid]);
  };

  db.getOwnBooks = function(uid) {
    return db.api.getOwnBooksAsync([uid]);
  };

  db.createBookRequest = function(uid, copyid) {
    return db.api.createBookRequestAsync([uid, copyid]);
  };

  db.deleteBookRequest = function(uid, copyid) {
    return db.api.deleteBookRequestAsync([uid, copyid]);
  };

  db.checkoutBook = function(requesterid, copyid) {
    return db.query("BEGIN;")
      .then(db.api.deleteBookRequestAsync.bind(null, [requesterid, copyid]))
      .then(db.api.createBorrowingAsync.bind(null, [requesterid, copyid]))
      .then(db.query.bind(db, "COMMIT;"));
  };

  db.checkinBook = function(borrowerid, copyid) {
    return db.api.deleteBorrowingAsync([borrowerid, copyid]);
  };

  db.getIncomingBookRequests = function(uid) {
    return db.api.getIncomingBookRequestsAsync([uid]);
  };

  db.getOutgoingBookRequests = function(uid) {
    return db.api.getOutgoingBookRequestsAsync([uid]);
  };

  db.getLentBooks = function(uid) {
    return db.api.getLentBooksAsync(uid);
  };

  db.getBorrowedBooks = function(uid) {
    return db.api.getBorrowedBooksAsync(uid);
  };

  db.getAvailableBooks = function(uid) {
    return db.api.getAvailableBooksAsync(uid);
  };
}

module.exports = function(connectionObject) {

  var db = pgp(connectionObject);




  return db;
};
