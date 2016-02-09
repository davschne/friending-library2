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

  ctx.createCopy = function(ownerid, book) {
    return ctx.tx(function(t) {
      var createBook = t.query(sql.createBook, [
        book.isbn,
        book.title,
        book.subtitle,
        book.authors,
        book.categories,
        book.publisher,
        book.publisheddate,
        book.description,
        book.pagecount,
        book.language,
        book.imagelink,
        book.volumelink
      ]);
      var createCopy = t.query(sql.createCopy, [book.isbn, ownerid]);
      return t.batch([createBook, createCopy]);
    })
    .then(function(res) {
      // return result of 2nd query (createCopy)
      // (will be object containing copyid)
      return res[1];
    });
  };

  ctx.deleteCopy = function(copyid) {
    return ctx.query(sql.deleteCopy, [copyid]);
  };

  ctx.createBookRequest = function(uid, copyid, request_date) {
    return ctx.query(sql.createBookRequest, [uid, copyid, request_date]);
  };

  ctx.deleteBookRequest = function(uid, copyid) {
    return ctx.query(sql.deleteBookRequest, [uid, copyid]);
  };

  ctx.checkoutBook = function(requesterid, copyid, checkout_date) {
    return ctx.tx(function(t) {
      var deleteBookRequest = t.query(sql.deleteBookRequest, [requesterid, copyid]);
      var createBorrowing = t.query(sql.createBorrowing, [requesterid, copyid, checkout_date]);
      return t.batch([deleteBookRequest, createBorrowing]);
    });
  };

  ctx.checkinBook = function(borrowerid, copyid) {
    return ctx.query(sql.deleteBorrowing, [borrowerid, copyid]);
  };

  ctx.getAvailableBooks = function(uid) {
    return ctx.query(sql.getAvailableBooks, [uid])
    .then(function(records) {
      // convert each record in db response to "copy" object
      return records.map(function(r) {
        return {
          copyid: r.copyid,
          owner : {
            id           : r.ownerid,
            display_name : r.owner_display_name
          },
          book : {
            isbn          : r.isbn,
            title         : r.title,
            subtitle      : r.subtitle,
            authors       : r.authors,
            categories    : r.categories,
            publisher     : r.publisher,
            publisheddate : r.publisheddate,
            description   : r.description,
            pagecount     : r.pagecount,
            language      : r.language,
            imagelink     : r.imagelink,
            volumelink    : r.volumelink
          }
        };
      });
    });
  };

  ctx.getOwnBooks = function(uid) {
    return ctx.query(sql.getOwnBooks, [uid])
    .then(function(records) {
      return records.map(function(r) {
        // convert each record in db response to "copy" object
        return {
          copyid: r.copyid,
          // not needed - user is owner
          // **************************
          // owner : {
          //   ownerid      : r.ownerid,
          //   display_name : r.owner_display_name
          // },
          book : {
            isbn          : r.isbn,
            title         : r.title,
            subtitle      : r.subtitle,
            authors       : r.authors,
            categories    : r.categories,
            publisher     : r.publisher,
            publisheddate : r.publisheddate,
            description   : r.description,
            pagecount     : r.pagecount,
            language      : r.language,
            imagelink     : r.imagelink,
            volumelink    : r.volumelink
          }
        };
      });
    });
  };

  ctx.getOutgoingBookRequests = function(uid) {
    return ctx.query(sql.getOutgoingBookRequests, [uid])
    .then(function(records) {
      return records.map(function(r) {
        return {
          copy: {
            copyid: r.copyid,
            owner : {
              id           : r.ownerid,
              display_name : r.owner_display_name
            },
            book : {
              isbn          : r.isbn,
              title         : r.title,
              subtitle      : r.subtitle,
              authors       : r.authors,
              categories    : r.categories,
              publisher     : r.publisher,
              publisheddate : r.publisheddate,
              description   : r.description,
              pagecount     : r.pagecount,
              language      : r.language,
              imagelink     : r.imagelink,
              volumelink    : r.volumelink
            }
          },
          // not needed - user is requester
          // ******************************,
          // requester: {
          //   id           : r.requesterid
          //   display_name : r.requester_display_name
          // },
          request_date : r.request_date
        };
      });
    });
  };

  ctx.getIncomingBookRequests = function(uid) {
    return ctx.query(sql.getIncomingBookRequests, [uid])
    .then(function(records) {
      return records.map(function(r) {
        return {
          copy: {
            copyid: r.copyid,
            //    not needed - user is owner
            //******************************
            // owner : {
            //   id      : r.ownerid,
            //   display_name : r.owner_display_name
            // },
            book : {
              isbn          : r.isbn,
              title         : r.title,
              subtitle      : r.subtitle,
              authors       : r.authors,
              categories    : r.categories,
              publisher     : r.publisher,
              publisheddate : r.publisheddate,
              description   : r.description,
              pagecount     : r.pagecount,
              language      : r.language,
              imagelink     : r.imagelink,
              volumelink    : r.volumelink
            }
          },
          requester: {
            id           : r.requesterid,
            display_name : r.requester_display_name
          },
          request_date : r.request_date
        };
      });
    });
  };

  ctx.getBorrowedBooks = function(uid) {
    return ctx.query(sql.getBorrowedBooks, [uid])
    .then(function(records) {
      return records.map(function(r) {
        return {
          copy: {
            copyid: r.copyid,
            owner : {
              id           : r.ownerid,
              display_name : r.owner_display_name
            },
            book : {
              isbn          : r.isbn,
              title         : r.title,
              subtitle      : r.subtitle,
              authors       : r.authors,
              categories    : r.categories,
              publisher     : r.publisher,
              publisheddate : r.publisheddate,
              description   : r.description,
              pagecount     : r.pagecount,
              language      : r.language,
              imagelink     : r.imagelink,
              volumelink    : r.volumelink
            }
          // not needed - user is borrower
          // *****************************
          // borrower: {
          //   id           : r.id,
          //   display_name : r.display_name
          // },
          },
          checkout_date : r.checkout_date,
          // due_date      : r.due_date
        };
      });
    });
  };

  ctx.getLentBooks = function(uid) {
    return ctx.query(sql.getLentBooks, [uid])
    .then(function(records) {
      return records.map(function(r) {
        return {
          copy: {
            copyid: r.copyid,
            // not needed - user is owner
            // **************************
            // owner : {
            //   id           : r.ownerid,
            //   display_name : r.owner_display_name
            // },
            book : {
              isbn          : r.isbn,
              title         : r.title,
              subtitle      : r.subtitle,
              authors       : r.authors,
              categories    : r.categories,
              publisher     : r.publisher,
              publisheddate : r.publisheddate,
              description   : r.description,
              pagecount     : r.pagecount,
              language      : r.language,
              imagelink     : r.imagelink,
              volumelink    : r.volumelink
            }
          },
          borrower: {
            id           : r.borrowerid,
            display_name : r.borrower_display_name
          },
          checkout_date : r.checkout_date,
          // due_date      : r.due_date
        };
      });
    });
  };

  ctx.disconnect = pgp.end;
}
