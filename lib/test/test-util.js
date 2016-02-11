var Promise = require("bluebird");

// utility function to return random elements from testData arrays
var rand = function(array) {
  var val = Math.floor(Math.random() * array.length);
  return array[val];
};

var formatBook = function(book, additions) {
  var out = Object.create(null);
  out.isbn           = book.isbn;
  out.title          = book.title;
  out.subtitle       = book.subtitle;
  out.authors        = book.authors;
  out.categories     = book.categories;
  out.publisher      = book.publisher;
  out.publisheddate  = book.publisheddate;
  out.description    = book.description;
  out.pagecount      = book.pagecount;
  out.language       = book.language;
  out.imagelink      = book.imagelink;
  out.volumelink     = book.volumelink;
  for (field in additions) {
    if (additions.hasOwnProperty(field) && typeof field !== "function") {
      out[field] = additions[field];
    }
  }
  return out;
};

// SQL for setup, teardown of tests

var insertUser = function(db, user) {
  var SQL = "INSERT INTO Users (facebookid, display_name) SELECT $1, $2 RETURNING uid;";
  return db.query(SQL, [user.facebookid, user.display_name]);
};

var deleteAllUsers = function(db) {
  var SQL = "DELETE FROM Users;";
  return db.query(SQL);
};

var insertBook = function(db, book) {
  var SQL = "INSERT INTO Books (isbn, title, subtitle, authors, categories, publisher, publisheddate, description, pagecount, language, imagelink, volumelink) SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 WHERE NOT EXISTS (SELECT isbn FROM Books WHERE isbn = CAST($1 AS varchar));"
  return db.query(SQL, [
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
};

var deleteAllBooks = function(db) {
  var SQL = "DELETE FROM Books;";
  return db.query(SQL);
};

var insertCopy = function(db, book, owner) {
  var SQL = "INSERT INTO Copies (isbn, ownerid) VALUES ($1, $2) RETURNING copyid;";
  return db.query(SQL, [book.isbn, owner.uid])
    .then(function(res) {
      return res;
    });
};

var deleteAllCopies = function(db) {
  var SQL = "DELETE FROM Copies;";
  return db.query(SQL);
};

var insertBookRequest = function(db, requester, copyid, request_date) {
  var SQL = "INSERT INTO BookRequests (requesterid, copyid, request_date) VALUES ($1, $2, $3);";
  return db.query(SQL, [requester.uid, copyid, request_date]);
};

var deleteAllBookRequests = function(db) {
  var SQL = "DELETE FROM BookRequests;";
  return db.query(SQL);
}

var insertBorrowing = function(db, borrower, copyid, checkout_date) {
  var SQL = "INSERT INTO Borrowing (borrowerid, copyid, checkout_date) VALUES ($1, $2, $3);";
  return db.query(SQL, [borrower.uid, copyid, checkout_date]);
};

var deleteAllBorrowing = function(db) {
  var SQL = "DELETE FROM Borrowing;";
  return db.query(SQL);
};

var createDBState = function(db, state) {
  /*
  @param : db (database connection instance)
  @param : state = {
    users : [ { uid, display_name, access_token }, ... ],
    books : [ { isbn, title, subtitle, authors, ... }, ... ],
    copies: [ { owner : user, book  : book, (copyid) }, ... ],
    bookrequests: [ { requester: user, copy: copy, request_date }, ... ],
    borrowing: [ { borrower: user, copy: copy, checkout_date } ]
  }
  */

  // insert users
  return Promise.resolve()
  .then(function() {
    if (state.users) {
      return state.users.reduce(function(seq, user) {
        return seq.then(insertUser.bind(null, db, user))
        .then(function(res) {
          // add uid property to user object
          state.copies[index].uid = res[0].uid;
        });
      }, Promise.resolve())
    }
  })
  // insert books
  .then(function() {
    if (state.books) {
      return state.books.reduce(function(seq, book) {
        return seq.then(insertBook.bind(null, db, book));
      }, Promise.resolve());
    }
  })
  // create copies
  .then(function() {
    if (state.copies) {
      return state.copies.reduce(function(seq, copy, index) {
        return seq.then(insertCopy.bind(null, db, copy.book, copy.owner))
        .then(function(res) {
          // add copyid property to copy object
          state.copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve());
    }
  })
  // create book requests
  .then(function() {
    if (state.bookrequests) {
      return state.bookrequests.reduce(function(seq, request) {
        return seq.then(insertBookRequest.bind(null, db, request.requester, request.copy.copyid, request.request_date));
      }, Promise.resolve());
    }
  })
  // create borrowing
  .then(function() {
    if (state.borrowing) {
      return state.borrowing.reduce(function(seq, borrowing) {
        return seq.then(insertBorrowing.bind(null, db, borrowing.borrower, borrowing.copy.copyid, borrowing.checkout_date));
      }, Promise.resolve());
    }
  });
};

var emptyDB = function(db) {

  // delete all borrowing
  return deleteAllBorrowing(db)
  // delete all book requests
  .then(deleteAllBookRequests.bind(null, db))
  // delete all copies
  .then(deleteAllCopies.bind(null, db))
  // delete all books
  .then(deleteAllBooks.bind(null, db))
  // delete all users
  .then(deleteAllUsers.bind(null, db));
};

var setUserTokens = function(redis, users) {
  /*
  @param: redis : redis connection instance
  @param: users : array of user objects
  */
  // insert access tokens
  return users.reduce(function(seq, user) {
    return seq.then(function() {
      return redis.set(user.access_token, user.uid);
    });
  }, Promise.resolve());
};

var deleteAllTokens = function(redis) {
  /*
  @param: redis : redis connection instance
  */
  return redis.flushdb();
};

module.exports = {
  rand                  : rand,
  formatBook            : formatBook,
  insertUser            : insertUser,
  deleteAllUsers        : deleteAllUsers,
  insertBook            : insertBook,
  deleteAllBooks        : deleteAllBooks,
  insertCopy            : insertCopy,
  deleteAllCopies       : deleteAllCopies,
  insertBookRequest     : insertBookRequest,
  deleteAllBookRequests : deleteAllBookRequests,
  insertBorrowing       : insertBorrowing,
  deleteAllBorrowing    : deleteAllBorrowing,
  createDBState         : createDBState,
  emptyDB               : emptyDB,
  setUserTokens         : setUserTokens,
  deleteAllTokens       : deleteAllTokens,
};
