var sql = require("./queries/load-sql-from-files");

module.exports = function(ctx, pgp) {

  ctx.createDBUser = function(user, password) {
    return ctx.query('CREATE USER $1^ PASSWORD $2', [user, password]);
  };

  ctx.createDatabase = function(database, owner, template) {
    return ctx.query('CREATE DATABASE $1^ OWNER $2^ TEMPLATE $3^', [database, owner, template]);
  };

  ctx.setupDatabase = function() {
    return ctx.query(sql.setupDatabase);
  };

  ctx.dropDatabase = function(database) {
    return ctx.query('DROP DATABASE $1^', database);
  };

  ctx.dropDBUser = function(user) {
    return ctx.query('DROP ROLE $1^', user);
  };

  ctx.findOrCreateUser = function(uid, displayName) {
    return ctx.query(sql.findOrCreateUser, [uid, displayName]);
  };

  ctx.deleteUser = function(uid) {
    return ctx.query(sql.deleteUser, [uid]);
  };

  ctx.createCopy = function(uid, ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall) {
    return ctx.tx(function(t) {
      var createBook = t.query(sql.createBook, [ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall]);
      var createCopy = t.query(sql.createCopy, [ISBN, uid]);
      return t.batch([createBook, createCopy]);
    })
    .then(function(res) {
      return res[1]; // return result of 2nd query (createCopy)
    });
  };

  ctx.deleteCopy = function(copyid) {
    return ctx.query(sql.deleteCopy, [copyid]);
  };

  ctx.getOwnBooks = function(uid) {
    return ctx.query(sql.getOwnBooks, [uid]);
  };

  ctx.createBookRequest = function(uid, copyid) {
    return ctx.query(sql.createBookRequest, [uid, copyid]);
  };

  ctx.deleteBookRequest = function(uid, copyid) {
    return ctx.query(sql.deleteBookRequest, [uid, copyid]);
  };

  ctx.checkoutBook = function(requesterid, copyid) {
    return ctx.tx(function(t) {
      var deleteBookRequest = t.query(sql.deleteBookRequest, [requesterid, copyid]);
      var createBorrowing = t.query(sql.createBorrowing, [requesterid, copyid]);
      return t.batch([deleteBookRequest, createBorrowing]);
    })
  };

  ctx.checkinBook = function(borrowerid, copyid) {
    return ctx.query(sql.deleteBorrowing, [borrowerid, copyid]);
  };

  ctx.getIncomingBookRequests = function(uid) {
    return ctx.query(sql.getIncomingBookRequests, [uid]);
  };

  ctx.getOutgoingBookRequests = function(uid) {
    return ctx.query(sql.getOutgoingBookRequests, [uid]);
  };

  ctx.getLentBooks = function(uid) {
    return ctx.query(sql.getLentBooks, [uid]);
  };

  ctx.getBorrowedBooks = function(uid) {
    return ctx.query(sql.getBorrowedBooks, [uid]);
  };

  ctx.getAvailableBooks = function(uid) {
    return ctx.query(sql.getAvailableBooks, [uid]);
  };

  ctx.disconnect = pgp.end;
}
