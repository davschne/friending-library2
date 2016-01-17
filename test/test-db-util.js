var chai = require("chai");
var expect = chai.expect;
var Promise = require("bluebird");

var DB = require('../lib/db.js');

var testData = require('../lib/test-data.js');

// utility function to return random elements from testData arrays
var rand = function(array) {
  var val = Math.floor(Math.random() * array.length);
  return array[val];
};

var PG_ADDRESS    = '127.0.0.1:5432';
var PG_ADMIN_USER = 'postgres';
var PG_ADMIN_PW   = '';
var TEST_DATABASE = 'friending_library_test';
var PG_TEST_URI   = 'postgres://' +
                    PG_ADMIN_USER + ':' +
                    PG_ADMIN_PW +
                    '@' + PG_ADDRESS + '/' +
                    TEST_DATABASE;

// SQL for setup, teardown of tests

var insertUser = function(db, user) {
  var SQL = "INSERT INTO Users (uID, display_name) SELECT $1, $2 WHERE NOT EXISTS (SELECT uID FROM Users WHERE uID = $1);";
  return db.run(SQL, [user.uid, user.display_name]);
};

var deleteAllUsers = function(db) {
  var SQL = "DELETE FROM Users;";
  return db.run(SQL);
};

var insertBook = function(db, book) {
  var SQL = "INSERT INTO Books (ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall) SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 WHERE NOT EXISTS (SELECT ISBN FROM Books WHERE ISBN = CAST($1 AS varchar));"
  return db.run(SQL, [
    book.ISBN[13] || book.ISBN[10],
    book.title,
    book.subtitle,
    book.authors,
    book.categories,
    book.publisher,
    book.publishedDate,
    book.description,
    book.pageCount,
    book.language,
    book.imageLinks.thumbnail,
    book.imageLinks.smallThumbnail
  ]);
};

var deleteAllBooks = function(db) {
  var SQL = "DELETE FROM Books;";
  return db.run(SQL);
};

var insertCopy = function(db, book, owner) {
  var SQL = "INSERT INTO Copies (ISBN, ownerID) VALUES ($1, $2) RETURNING copyid;";
  return db.run(SQL, [book.ISBN[13] || book.ISBN[10], owner.uid])
    .then(function(res) {
      return res;
    });
};

var insertBookRequest = function(db, requester, copyid) {
  var SQL = "INSERT INTO BookRequests (requesterid, copyid, request_date) VALUES ($1, $2, CURRENT_TIMESTAMP);";
  return db.run(SQL, [requester.uid, copyid]);
};

var insertBorrowing = function(db, borrower, copyid) {
  var SQL = "INSERT INTO Borrowing (borrowerID, copyID, checkout_date) VALUES ($1, $2, CURRENT_TIMESTAMP);";
  return db.run(SQL, [borrower.uid, copyid]);
};

var deleteAllBorrowing = function(db) {
  var SQL = "DELETE FROM BORROWING;";
  return db.run(SQL);
};

// database instance
var db;

describe('db.js', function() {

  // get database connection instance
  before(function() {
    db = new DB(PG_TEST_URI);
  });

  describe('#findOrCreateUser', function() {

    var user = rand(testData.users);

    it("should return a response object", function(done) {
      db.findOrCreateUser(user.uid, user.display_name)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should create a tuple in the Users table if it doesn't already exist", function(done) {
      db.run("SELECT uid FROM Users WHERE uid=$1;", [user.uid])
      .then(function(res) {
        expect(res[0].uid).to.equal(user.uid.toString());
        done();
      });
    });

    // cleanup: delete the user
    after(function(done) {
      deleteAllUsers(db)
      .then(function(res) {
        done();
      });
    })
  });

  describe('#deleteUser', function() {

    var user = rand(testData.users);

    // setup: create the user
    before(function(done) {
      insertUser(db, user)
      .then(function(res) {
        done();
      });
    });

    it("should return a response object", function(done) {
      db.deleteUser(user.uid)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should delete a tuple from the Users table", function(done) {
      db.run("SELECT uid FROM Users WHERE uid=$1;", [user.uid])
      .then(function(res) {
        expect(res).to.be.empty; // expect empty array
        done();
      });
    });
  });

  describe('#createCopy', function() {

    var user = rand(testData.users);
    var book = rand(testData.books);
    var ISBN = book.ISBN[13] || book.ISBN[10];

    // setup: create user to own the copy
    before(function(done) {
      insertUser(db, user)
      .then(function(res) {
        done();
      });
    });

    it("should return a response object containing the copyid", function(done) {
      db.createCopy(
        user.uid,
        ISBN,
        book.title,
        book.subtitle,
        book.authors,
        book.categories,
        book.publisher,
        book.publishedDate,
        book.description,
        book.pageCount,
        book.language,
        book.imageLinks.thumbnail,
        book.imageLinks.smallThumbnail
      )
      .then(function(res) {
        expect(res).to.exist;
        expect(res[0]).to.have.property("copyid");
        expect(res[0].copyid).to.be.a("number");
        done();
      });
    });

    it("should create a tuple in the Copies table", function(done) {
      db.run("SELECT ownerid FROM Copies WHERE ownerid=$1 AND isbn=$2;", [user.uid, ISBN])
      .then(function(res) {
        expect(res[0].ownerid).to.equal(user.uid.toString());
        done();
      });
    });

    it("should create a tuple in the Books table if it doesn't already exist", function(done) {
      db.run("SELECT isbn FROM Books WHERE isbn=$1;", [ISBN])
      .then(function(res) {
        expect(res[0].isbn).to.equal(ISBN);
        done();
      });
    });

    // cleanup: delete user and book (cascade should delete the copy)
    after(function(done) {
      deleteAllUsers(db)
      .then(deleteAllBooks.bind(null, db))
      .then(function(res) {
        done();
      });
    });
  });

  describe("#deleteCopy", function() {

    var user = rand(testData.users);
    var book = rand(testData.books);
    var ISBN = book.ISBN[13] || book.ISBN[10];
    var copyid;

    // setup: insert user, book, and copy; retrieve and store copyid
    before(function(done) {
      insertUser(db, user)
      .then(insertBook.bind(null, db, book))
      .then(insertCopy.bind(null, db, book, user))
      .then(function(res) {
        copyid = res[0].copyid;
        done();
      });
    });

    it("should return a response object", function(done) {
      db.deleteCopy(copyid)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should delete the tuple from the Copies table", function(done) {
      db.run("SELECT copyid FROM Copies WHERE copyid=$1;", [copyid])
      .then(function(res) {
        expect(res).to.be.empty;
        done();
      });
    });

    // cleanup: delete user and book
    after(function(done) {
      deleteAllUsers(db)
      .then(deleteAllBooks.bind(null, db))
      .then(function(res) {
        done();
      });
    });
  });

  describe("#getOwnBooks", function() {

    var user = rand(testData.users);
    var books = testData.books;

    // setup: add user, add four books, add three copies owned by user (two duplicate)
    before(function(done) {
      // insert Users tuple
      insertUser(db, user)
      // insert four Books tuples
      .then(function() {
        // build chain of Promises
        return books.slice(0, 4).reduce(function(seq, book) {
          return seq.then(function() {
            return insertBook(db, book);
          });
        }, Promise.resolve());
      })
      .then(function() {
        // insert three Copies tuples (incl. two duplicates)
        var copies = [books[0], books[0], books[1]];
        // build chain of Promises
        return copies.reduce(function(seq, book) {
          return seq.then(function() {
            return insertCopy(db, book, user);
          });
        }, Promise.resolve());
      })
      .then(function() {
        done();
      });
    });

    it("should return tuples matching all Books owned by the User, including multiple copies of the same Book", function(done) {
      db.getOwnBooks(user.uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        expect(res[0].isbn).to.equal(books[0].ISBN[13] || books[0].ISBN[10]);
        expect(res[1].isbn).to.equal(books[1].ISBN[13] || books[1].ISBN[10]);
        expect(res[0].copyids).to.have.length(2);
        done();
      });
    });

    // cleanup: delete Users and Books tuples (Copies deletion will cascade)
    after(function(done) {
      deleteAllUsers(db)
      .then(deleteAllBooks.bind(null, db))
      .then(function() {
        done();
      });
    });
  });

  describe("#createBookRequest", function() {

    var owner = testData.users[0];
    var requester = testData.users[1];
    var book = rand(testData.books);
    var ISBN = book.ISBN[13] || book.ISBN[10];
    var copyid;

    // setup: create users, book, copy, store copyid for later
    before(function(done) {
      insertUser(db, owner)
      .then(insertUser.bind(null, db, requester))
      .then(insertBook.bind(null, db, book))
      .then(insertCopy.bind(null, db, book, owner))
      .then(function(res) {
        copyid = res[0].copyid;
        done();
      });
    });

    it("should return a response object", function(done) {
      db.createBookRequest(requester.uid, copyid)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should create a tuple in BookRequests", function(done) {
      db.run("SELECT * FROM BookRequests WHERE requesterid=$1 AND copyid=$2;", [requester.uid, copyid])
      .then(function(res) {
        expect(res).to.exist;
        expect(res[0]).to.have.property("requesterid");
        expect(res[0].requesterid).to.equal(requester.uid.toString());
        expect(res[0]).to.have.property("copyid");
        expect(res[0].copyid).to.equal(copyid);
        done();
      });
    });

    // cleanup: delete users and book (copy and request will cascade)
    after(function(done) {
      deleteAllUsers(db)
      .then(deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#deleteBookRequest", function() {

    var owner = testData.users[0];
    var requester = testData.users[1];
    var book = rand(testData.books);
    var ISBN = book.ISBN[13] || book.ISBN[10];
    var copyid;

    // setup: create users, book, copy, bookrequest, store copyid for later
    before(function(done) {
      insertUser(db, owner)
      .then(insertUser.bind(null, db, requester))
      .then(insertBook.bind(null, db, book))
      .then(insertCopy.bind(null, db, book, owner))
      .then(function(res) {
        copyid = res[0].copyid;
        return insertBookRequest(db, requester, copyid);
      })
      .then(done.bind(null, null));
    });

    it("should return a response object", function(done) {
      db.deleteBookRequest(requester.uid, copyid)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should delete a tuple from BookRequests", function(done) {
      db.run("SELECT * FROM BookRequests WHERE requesterid=$1 AND copyid=$2;", [requester.uid, copyid])
      .then(function(res) {
        expect(res).to.be.empty;
        done();
      });
    });

    // cleanup: delete users, book (copy will cascade)
    after(function(done) {
      deleteAllUsers(db)
      .then(deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#checkoutBook", function() {
    var owner = testData.users[0];
    var requester = testData.users[1];
    var book = rand(testData.books);
    var ISBN = book.ISBN[13] || book.ISBN[10];
    var copyid;

    // setup: create users, book, copy, bookrequest, store copyid for later
    before(function(done) {
      insertUser(db, owner)
      .then(insertUser.bind(null, db, requester))
      .then(insertBook.bind(null, db, book))
      .then(insertCopy.bind(null, db, book, owner))
      .then(function(res) {
        copyid = res[0].copyid;
        return insertBookRequest(db, requester, copyid);
      })
      .then(done.bind(null, null));
    });

    it("should return a response object", function(done) {
      db.checkoutBook(requester.uid, copyid)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should delete a tuple from BookRequests", function(done) {
      db.run("SELECT * FROM BookRequests WHERE requesterid=$1 AND copyid=$2;", [requester.uid, copyid])
      .then(function(res) {
        expect(res).to.be.empty;
        done();
      });
    });

    it("should insert a tuple into Borrowing", function(done) {
      db.run("SELECT * FROM Borrowing WHERE borrowerid=$1 AND copyid=$2;", [requester.uid, copyid])
      .then(function(res) {
        expect(res).to.exist;
        expect(res[0]).to.have.property("borrowerid");
        expect(res[0].borrowerid).to.equal(requester.uid.toString());
        expect(res[0]).to.have.property("copyid");
        expect(res[0].copyid).to.equal(copyid);
        done();
      });
    });

    // cleanup: delete borrowing, users, books (copies will cascade)
    after(function(done) {
      deleteAllBorrowing(db)
      .then(deleteAllUsers.bind(null, db))
      .then(deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#checkinBook", function(done) {
    var owner = testData.users[0];
    var borrower = testData.users[1];
    var book = rand(testData.books);
    var ISBN = book.ISBN[13] || book.ISBN[10];
    var copyid;

    // setup: create users, book, copy, borrowing, store copyid for later
    before(function(done) {
      insertUser(db, owner)
      .then(insertUser.bind(null, db, borrower))
      .then(insertBook.bind(null, db, book))
      .then(insertCopy.bind(null, db, book, owner))
      .then(function(res) {
        copyid = res[0].copyid;
        return insertBorrowing(db, borrower, copyid);
      })
      .then(done.bind(null, null));
    });

    it("should return a response object", function(done) {
      db.checkinBook(borrower.uid, copyid)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should delete a tuple from Borrowing", function(done) {
      db.run("SELECT * FROM Borrowing WHERE borrowerid=$1 AND copyid=$2;", [borrower.uid, copyid])
      .then(function(res) {
        expect(res).to.be.empty;
        done();
      });
    });

    // cleanup: delete users, books (copies will cascade)
    after(function(done) {
      deleteAllUsers(db)
      .then(deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#getIncomingBookRequests", function() {

    // users[0] is target for incoming book requests
    var users = testData.users;
    var books = testData.books;
    var copies = [
      { owner: users[0], book: books[0] },
      { owner: users[0], book: books[1] },
      { owner: users[0], book: books[2] }, // not in result set
      { owner: users[1], book: books[3] }  // not in result set
    ];

    var requests = [
      { requester: users[0], copy: copies[3] }, // not in result set
      { requester: users[1], copy: copies[1] },
      { requester: users[2], copy: copies[0] }
    ];

    // setup: create users, books, copies, book requests
    before(function(done) {
      // insert Users tuples (chain of Promises)
      users.reduce(function(seq, user) {
        return seq.then(insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert Books tuples
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert Copies tuples
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(function() {
          return insertCopy(db, copy.book, copy.owner);
        })
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      // insert BookRequests tuples
      .then(requests.reduce.bind(requests, function(seq, request) {
        return seq.then(insertBookRequest.bind(null, db, request.requester, request.copy.copyid));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the user's incoming book requests", function(done) {
      db.getIncomingBookRequests(users[0].uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        expect(res[0].copyid).to.equal(requests[1].copy.copyid);
        expect(res[0].requesterid).to.equal(requests[1].requester.uid.toString());
        expect(res[0].isbn).to.equal(requests[1].copy.book.ISBN[13] || requests[1].copy.book.ISBN[10]);
        expect(res[1].copyid).to.equal(requests[2].copy.copyid);
        expect(res[1].requesterid).to.equal(requests[2].requester.uid.toString());
        expect(res[1].isbn).to.equal(requests[2].copy.book.ISBN[13] || requests[2].copy.book.ISBN[10]);
        done();
      });
    });

    // cleanup: delete users, books (copies, book requests will cascade)
    after(function(done) {
      deleteAllUsers(db)
      .then(deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#getOutgoingBookRequests", function() {
    // users[0] is requester for outgoing book requests
    var users = testData.users;
    var books = testData.books;
    var copies = [
      { owner: users[0], book: books[0] }, // not in result set
      { owner: users[1], book: books[1] }, // not in result set
      { owner: users[2], book: books[2] },
      { owner: users[3], book: books[3] }
    ];

    var requests = [
      { requester: users[0], copy: copies[2] },
      { requester: users[0], copy: copies[3] },
      { requester: users[3], copy: copies[1] } // not in result set
    ];

    // setup: create users, books, copies, book requests
    before(function(done) {
      // insert Users tuples (chain of Promises)
      users.reduce(function(seq, user) {
        return seq.then(insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert Books tuples
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert Copies tuples
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(function() {
          return insertCopy(db, copy.book, copy.owner);
        })
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      // insert BookRequests tuples
      .then(requests.reduce.bind(requests, function(seq, request) {
        return seq.then(insertBookRequest.bind(null, db, request.requester, request.copy.copyid));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the user's outgoing book requests", function(done) {
      db.getOutgoingBookRequests(users[0].uid)
      .then(function(res) {
        // console.log(res);
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        expect(res[0].copyid).to.equal(requests[0].copy.copyid);
        expect(res[0].ownerid).to.equal(requests[0].copy.owner.uid.toString());
        expect(res[0].isbn).to.equal(requests[0].copy.book.ISBN[13] || requests[0].copy.book.ISBN[10]);
        expect(res[1].copyid).to.equal(requests[1].copy.copyid);
        expect(res[1].ownerid).to.equal(requests[1].copy.owner.uid.toString());
        expect(res[1].isbn).to.equal(requests[1].copy.book.ISBN[13] || requests[1].copy.book.ISBN[10]);
        done();
      });
    });

    // cleanup: delete users, books (copies, book requests will cascade)
    after(function(done) {
      deleteAllUsers(db)
      .then(deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  // close connection to database
  after(function() {
    db.disconnect();
  });
});
