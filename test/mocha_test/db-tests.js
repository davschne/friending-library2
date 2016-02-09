/* jshint expr: true */

var chai = require("chai");
var expect = chai.expect;
var Promise = require("bluebird");

var DB       = require('../../lib/db/pgp.js');
var config   = require('../../config.js');
var util     = require('../../lib/test/test-util.js');
var testData = require('../../lib/test/test-data.js');

// database instance
var db;

describe('db.js', function() {

  // get database connection instance
  before(function() {
    db = new DB(config.pg.test);
  });

  describe('#findOrCreateUser', function() {

    var user = util.rand(testData.users);

    it("should return a response object", function(done) {
      db.findOrCreateUser(user.uid, user.display_name)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should create a tuple in the Users table if it doesn't already exist", function(done) {
      db.query("SELECT uid FROM Users WHERE uid=$1;", [user.uid])
      .then(function(res) {
        expect(res[0].uid).to.equal(user.uid.toString());
        done();
      });
    });

    // cleanup: delete the user
    after(function(done) {
      util.deleteAllUsers(db)
      .then(function(res) {
        done();
      });
    })
  });

  describe('#deleteUser', function() {

    var user = util.rand(testData.users);

    // setup: create the user
    before(function(done) {
      util.insertUser(db, user)
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
      db.query("SELECT uid FROM Users WHERE uid=$1;", [user.uid])
      .then(function(res) {
        expect(res).to.be.empty; // expect empty array
        done();
      });
    });
  });

  describe('#createCopy', function() {

    var user = util.rand(testData.users);
    var book = util.rand(testData.books);
    var isbn = book.isbn;

    // setup: create user to own the copy
    before(function(done) {
      util.insertUser(db, user)
      .then(function(res) {
        done();
      });
    });

    it("should return a response object containing the copyid", function(done) {
      db.createCopy(user.uid, book)
      .then(function(res) {
        expect(res).to.exist;
        expect(res[0]).to.have.property("copyid");
        expect(res[0].copyid).to.be.a("number");
        done();
      });
    });

    it("should create a tuple in the Copies table", function(done) {
      db.query("SELECT ownerid FROM Copies WHERE ownerid=$1 AND isbn=$2;", [user.uid, isbn])
      .then(function(res) {
        expect(res[0].ownerid).to.equal(user.uid.toString());
        done();
      });
    });

    it("should create a tuple in the Books table if it doesn't already exist", function(done) {
      db.query("SELECT isbn FROM Books WHERE isbn=$1;", [isbn])
      .then(function(res) {
        expect(res[0].isbn).to.equal(isbn);
        done();
      });
    });

    // cleanup: delete user and book (cascade should delete the copy)
    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(function(res) {
        done();
      });
    });
  });

  describe("#deleteCopy", function() {

    var user = util.rand(testData.users);
    var book = util.rand(testData.books);
    var isbn = book.isbn;
    var copyid;

    // setup: insert user, book, and copy; retrieve and store copyid
    before(function(done) {
      util.insertUser(db, user)
      .then(util.insertBook.bind(null, db, book))
      .then(util.insertCopy.bind(null, db, book, user))
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
      db.query("SELECT copyid FROM Copies WHERE copyid=$1;", [copyid])
      .then(function(res) {
        expect(res).to.be.empty;
        done();
      });
    });

    // cleanup: delete user and book
    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(function(res) {
        done();
      });
    });
  });

  describe("#createBookRequest", function() {

    var owner = testData.users[0];
    var requester = testData.users[1];
    var book = util.rand(testData.books);
    var isbn = book.isbn;
    var copyid;
    var request_date = new Date();

    // setup: create users, book, copy, store copyid for later
    before(function(done) {
      util.insertUser(db, owner)
      .then(util.insertUser.bind(null, db, requester))
      .then(util.insertBook.bind(null, db, book))
      .then(util.insertCopy.bind(null, db, book, owner))
      .then(function(res) {
        copyid = res[0].copyid;
        done();
      });
    });

    it("should return a response object", function(done) {
      db.createBookRequest(requester.uid, copyid, request_date)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should create a tuple in BookRequests", function(done) {
      db.query("SELECT * FROM BookRequests WHERE requesterid=$1 AND copyid=$2;", [requester.uid, copyid])
      .then(function(res) {
        expect(res).to.exist;
        expect(res[0]).to.have.property("requesterid");
        expect(res[0].requesterid).to.equal(requester.uid.toString());
        expect(res[0]).to.have.property("copyid");
        expect(res[0].copyid).to.equal(copyid);
        expect(res[0]).to.have.property("request_date");
        var rounding_error = res[0].request_date.valueOf() - request_date.valueOf();
        expect(Math.abs(rounding_error)).to.be.below(1000);
        done();
      });
    });

    // cleanup: delete users and book (copy and request will cascade)
    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#deleteBookRequest", function() {

    var owner = testData.users[0];
    var requester = testData.users[1];
    var book = util.rand(testData.books);
    var isbn = book.isbn;
    var copyid;

    // setup: create users, book, copy, bookrequest, store copyid for later
    before(function(done) {
      util.insertUser(db, owner)
      .then(util.insertUser.bind(null, db, requester))
      .then(util.insertBook.bind(null, db, book))
      .then(util.insertCopy.bind(null, db, book, owner))
      .then(function(res) {
        copyid = res[0].copyid;
        return util.insertBookRequest(db, requester, copyid);
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
      db.query("SELECT * FROM BookRequests WHERE requesterid=$1 AND copyid=$2;", [requester.uid, copyid])
      .then(function(res) {
        expect(res).to.be.empty;
        done();
      });
    });

    // cleanup: delete users, book (copy will cascade)
    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#checkoutBook", function() {
    var owner = testData.users[0];
    var requester = testData.users[1];
    var book = util.rand(testData.books);
    var isbn = book.isbn;
    var checkout_date = new Date();
    var copyid;

    // setup: create users, book, copy, bookrequest, store copyid for later
    before(function(done) {
      util.insertUser(db, owner)
      .then(util.insertUser.bind(null, db, requester))
      .then(util.insertBook.bind(null, db, book))
      .then(util.insertCopy.bind(null, db, book, owner))
      .then(function(res) {
        copyid = res[0].copyid;
        return util.insertBookRequest(db, requester, copyid, new Date());
      })
      .then(done.bind(null, null));
    });

    it("should return a response object", function(done) {
      db.checkoutBook(requester.uid, copyid, checkout_date)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should delete a tuple from BookRequests", function(done) {
      db.query("SELECT * FROM BookRequests WHERE requesterid=$1 AND copyid=$2;", [requester.uid, copyid])
      .then(function(res) {
        expect(res).to.be.empty;
        done();
      });
    });

    it("should insert a tuple into Borrowing", function(done) {
      db.query("SELECT * FROM Borrowing WHERE borrowerid=$1 AND copyid=$2;", [requester.uid, copyid])
      .then(function(res) {
        expect(res).to.exist;
        expect(res[0]).to.have.property("borrowerid");
        expect(res[0].borrowerid).to.equal(requester.uid.toString());
        expect(res[0]).to.have.property("copyid");
        expect(res[0].copyid).to.equal(copyid);
        expect(res[0]).to.have.property("checkout_date");
        var rounding_error = res[0].checkout_date.valueOf() - checkout_date.valueOf();
        expect(Math.abs(rounding_error)).to.be.below(1000);
        done();
      });
    });

    // cleanup: delete borrowing, users, books (copies will cascade)
    after(function(done) {
      util.deleteAllBorrowing(db)
      .then(util.deleteAllUsers.bind(null, db))
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#checkinBook", function(done) {
    var owner = testData.users[0];
    var borrower = testData.users[1];
    var book = util.rand(testData.books);
    var isbn = book.isbn;
    var copyid;

    // setup: create users, book, copy, borrowing, store copyid for later
    before(function(done) {
      util.insertUser(db, owner)
      .then(util.insertUser.bind(null, db, borrower))
      .then(util.insertBook.bind(null, db, book))
      .then(util.insertCopy.bind(null, db, book, owner))
      .then(function(res) {
        copyid = res[0].copyid;
        return util.insertBorrowing(db, borrower, copyid);
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
      db.query("SELECT * FROM Borrowing WHERE borrowerid=$1 AND copyid=$2;", [borrower.uid, copyid])
      .then(function(res) {
        expect(res).to.be.empty;
        done();
      });
    });

    // cleanup: delete users, books (copies will cascade)
    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#getAvailableBooks", function() {
    // one copy is currently borrowed
    // one is already requested by user
    // one belongs to user
    // should return just one book
    var users = testData.users;
    var books = testData.books;
    var copies = [
      { owner: users[0], book: books[0]},
      { owner: users[1], book: books[1]},
      { owner: users[2], book: books[2]},
      { owner: users[3], book: books[3]}  // in result set
    ];
    var request = { requester: users[0], copy: copies[1]};
    var borrowing = { borrower: users[0], copy: copies[2]};

    // setup: create users, books, copies, borrowing
    before(function(done) {
      // insert Users tuples (chain of Promises)
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert Books tuples
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert Copies tuples
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(function() {
          return util.insertCopy(db, copy.book, copy.owner);
        })
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      // insert Book Request tuple
      .then(function() {
        return util.insertBookRequest(db, request.requester, request.copy.copyid);
      })
      // insert Borrowing tuple
      .then(function() {
        return util.insertBorrowing(db, borrowing.borrower, borrowing.copy.copyid);
      })
      .then(done.bind(null, null));
    });

    it("should return an array of books that aren't currently borrowed, haven't already been requested by the user, and don't belong to the user", function(done) {
      db.getAvailableBooks(users[0].uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(1);
        expect(res[0].copyid).to.equal(copies[3].copyid);
        expect(res[0]).to.have.deep.property("owner.id", copies[3].owner.uid.toString());
        expect(res[0]).to.have.deep.property("owner.display_name", copies[3].owner.display_name);
        expect(res[0]).to.have.property("book");
        expect(res[0].book).to.deep.equal(books[3]);
        done();
      });
    });

    // delete Borrowing, Users, Books (Copies, Book Request will cascade)
    after(function(done) {
      util.deleteAllBorrowing(db)
      .then(util.deleteAllUsers.bind(null, db))
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#getOwnBooks", function() {

    var user = util.rand(testData.users);
    var books = testData.books;
    // we'll insert three Copies tuples (incl. two duplicates)
    var copies = [
      { owner: user, book: books[0] },
      { owner: user, book: books[0] },
      { owner: user, book: books[1] }
    ];

    // setup: add user, add four books, add three copies owned by user (two duplicate)
    before(function(done) {
      // insert Users tuple
      util.insertUser(db, user)
      // insert four Books tuples
      .then(function() {
        // build chain of Promises
        return books.slice(0, 4).reduce(function(seq, book) {
          return seq.then(function() {
            return util.insertBook(db, book);
          });
        }, Promise.resolve());
      })
      // insert copies tuples
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(function() {
          return util.insertCopy(db, copy.book, copy.owner);
        })
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return tuples matching all Books owned by the User, including multiple copies of the same Book", function(done) {
      db.getOwnBooks(user.uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(3);
        res.forEach(function(record) {
          expect(record).to.have.property("copyid");
          expect(record).to.have.deep.property("book.isbn");
          expect(record).to.have.deep.property("book.title");
          expect(record).to.have.deep.property("book.subtitle");
          expect(record).to.have.deep.property("book.authors");
          expect(record).to.have.deep.property("book.categories");
          expect(record).to.have.deep.property("book.publisher");
          expect(record).to.have.deep.property("book.publisheddate");
          expect(record).to.have.deep.property("book.description");
          expect(record).to.have.deep.property("book.pagecount");
          expect(record).to.have.deep.property("book.language");
          expect(record).to.have.deep.property("book.imagelink");
          expect(record).to.have.deep.property("book.volumelink");
        });
        done();
      });
    });

    // cleanup: delete Users and Books tuples (Copies deletion will cascade)
    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(function() {
        done();
      });
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
      { requester: users[0], copy: copies[2], request_date: new Date() },
      { requester: users[0], copy: copies[3], request_date: new Date() },
      // not in result set:
      { requester: users[3], copy: copies[1], request_date: new Date() }
    ];

    // setup: create users, books, copies, book requests
    before(function(done) {
      // insert Users tuples (chain of Promises)
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert Books tuples
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert Copies tuples
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(function() {
          return util.insertCopy(db, copy.book, copy.owner);
        })
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      // insert BookRequests tuples
      .then(requests.reduce.bind(requests, function(seq, request) {
        return seq.then(util.insertBookRequest.bind(null, db, request.requester, request.copy.copyid, request.request_date));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the user's outgoing book requests", function(done) {
      db.getOutgoingBookRequests(users[0].uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        res.forEach(function(record) {
          expect(record).to.have.property("request_date");
          expect(record).to.have.deep.property("copy.copyid");
          expect(record).to.have.deep.property("copy.book.isbn");
          expect(record).to.have.deep.property("copy.book.title");
          expect(record).to.have.deep.property("copy.book.subtitle");
          expect(record).to.have.deep.property("copy.book.authors");
          expect(record).to.have.deep.property("copy.book.categories");
          expect(record).to.have.deep.property("copy.book.publisher");
          expect(record).to.have.deep.property("copy.book.publisheddate");
          expect(record).to.have.deep.property("copy.book.description");
          expect(record).to.have.deep.property("copy.book.pagecount");
          expect(record).to.have.deep.property("copy.book.language");
          expect(record).to.have.deep.property("copy.book.imagelink");
          expect(record).to.have.deep.property("copy.book.volumelink");
        });
        done();
      });
    });

    // cleanup: delete users, books (copies, book requests will cascade)
    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
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
      // not in result set:
      { requester: users[0], copy: copies[3], request_date: new Date() },
      // in result set:
      { requester: users[1], copy: copies[1], request_date: new Date() },
      { requester: users[2], copy: copies[0], request_date: new Date() }
    ];

    // setup: create users, books, copies, book requests
    before(function(done) {
      // insert Users tuples (chain of Promises)
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert Books tuples
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert Copies tuples
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(function() {
          return util.insertCopy(db, copy.book, copy.owner);
        })
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      // insert BookRequests tuples
      .then(requests.reduce.bind(requests, function(seq, request) {
        return seq.then(util.insertBookRequest.bind(null, db, request.requester, request.copy.copyid, request.request_date));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the user's incoming book requests", function(done) {
      db.getIncomingBookRequests(users[0].uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        res.forEach(function(record) {
          expect(record).to.have.property("request_date");
          expect(record).to.have.deep.property("requester.id");
          expect(record).to.have.deep.property("requester.display_name");
          expect(record).to.have.deep.property("copy.copyid");
          expect(record).to.have.deep.property("copy.book.isbn");
          expect(record).to.have.deep.property("copy.book.title");
          expect(record).to.have.deep.property("copy.book.subtitle");
          expect(record).to.have.deep.property("copy.book.authors");
          expect(record).to.have.deep.property("copy.book.categories");
          expect(record).to.have.deep.property("copy.book.publisher");
          expect(record).to.have.deep.property("copy.book.publisheddate");
          expect(record).to.have.deep.property("copy.book.description");
          expect(record).to.have.deep.property("copy.book.pagecount");
          expect(record).to.have.deep.property("copy.book.language");
          expect(record).to.have.deep.property("copy.book.imagelink");
          expect(record).to.have.deep.property("copy.book.volumelink");
        });
        done();
      });
    });

    // cleanup: delete users, books (copies, book requests will cascade)
    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });


  describe("#getBorrowedBooks", function() {
    // users[0] is borrower
    var users = testData.users;
    var books = testData.books;
    var copies = [
      { owner: users[0], book: books[0] }, // not in result set
      { owner: users[1], book: books[1] }, // not in result set
      { owner: users[2], book: books[2] },
      { owner: users[3], book: books[3] }
    ];

    var borrowing = [
      { borrower: users[0], copy: copies[2], checkout_date: new Date() },
      { borrower: users[0], copy: copies[3], checkout_date: new Date() },
      // not in result set:
      { borrower: users[3], copy: copies[1], checkout_date: new Date() }
    ];

    // setup: create users, books, copies, borrowing
    before(function(done) {
      // insert Users tuples (chain of Promises)
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert Books tuples
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert Copies tuples
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(function() {
          return util.insertCopy(db, copy.book, copy.owner);
        })
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      // insert Borrowing tuples
      .then(borrowing.reduce.bind(borrowing, function(seq, borrowing) {
        return seq.then(util.insertBorrowing.bind(null, db, borrowing.borrower, borrowing.copy.copyid, borrowing.checkout_date));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the books the user is currently borrowing", function(done) {
      db.getBorrowedBooks(users[0].uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        res.forEach(function(record) {
          expect(record).to.have.property("checkout_date");
          expect(record).to.have.deep.property("copy.copyid");
          expect(record).to.have.deep.property("copy.owner.id");
          expect(record).to.have.deep.property("copy.owner.display_name");
          expect(record).to.have.deep.property("copy.book.isbn");
          expect(record).to.have.deep.property("copy.book.title");
          expect(record).to.have.deep.property("copy.book.subtitle");
          expect(record).to.have.deep.property("copy.book.authors");
          expect(record).to.have.deep.property("copy.book.categories");
          expect(record).to.have.deep.property("copy.book.publisher");
          expect(record).to.have.deep.property("copy.book.publisheddate");
          expect(record).to.have.deep.property("copy.book.description");
          expect(record).to.have.deep.property("copy.book.pagecount");
          expect(record).to.have.deep.property("copy.book.language");
          expect(record).to.have.deep.property("copy.book.imagelink");
          expect(record).to.have.deep.property("copy.book.volumelink");
        });
        done();
      });
    });

    // cleanup: delete borrowing, users, books (copies will cascade)
    after(function(done) {
      util.deleteAllBorrowing(db)
      .then(util.deleteAllUsers.bind(null, db))
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("#getLentBooks", function() {

    // users[0] is lender
    var users = testData.users;
    var books = testData.books;
    var copies = [
      { owner: users[0], book: books[0] },
      { owner: users[0], book: books[1] },
      { owner: users[0], book: books[2] }, // not in result set
      { owner: users[1], book: books[3] }  // not in result set
    ];

    var borrowing = [
      // not in result set:
      { borrower: users[0], copy: copies[3], checkout_date: new Date() },
      // in result set:
      { borrower: users[1], copy: copies[1], checkout_date: new Date() },
      { borrower: users[2], copy: copies[0], checkout_date: new Date() }
    ];

    // setup: create users, books, copies, borrowing
    before(function(done) {
      // insert Users tuples (chain of Promises)
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert Books tuples
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert Copies tuples
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(function() {
          return util.insertCopy(db, copy.book, copy.owner);
        })
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      // insert Borrowing tuples
      .then(borrowing.reduce.bind(borrowing, function(seq, borrowing) {
        return seq.then(util.insertBorrowing.bind(null, db, borrowing.borrower, borrowing.copy.copyid, borrowing.checkout_date));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the user's books currently being borrowed", function(done) {
      db.getLentBooks(users[0].uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        res.forEach(function(element) {
          expect(element).to.have.property("checkout_date");
          expect(element).to.have.deep.property("borrower.id");
          expect(element).to.have.deep.property("borrower.display_name");
          expect(element).to.have.deep.property("copy.copyid");
          expect(element).to.have.deep.property("copy.book.isbn");
          expect(element).to.have.deep.property("copy.book.title");
          expect(element).to.have.deep.property("copy.book.subtitle");
          expect(element).to.have.deep.property("copy.book.authors");
          expect(element).to.have.deep.property("copy.book.categories");
          expect(element).to.have.deep.property("copy.book.publisher");
          expect(element).to.have.deep.property("copy.book.publisheddate");
          expect(element).to.have.deep.property("copy.book.description");
          expect(element).to.have.deep.property("copy.book.pagecount");
          expect(element).to.have.deep.property("copy.book.language");
          expect(element).to.have.deep.property("copy.book.imagelink");
          expect(element).to.have.deep.property("copy.book.volumelink");
        });
        done();
      });
    });

    // cleanup: delete borrowing, users, books (copies will cascade)
    after(function(done) {
      util.deleteAllBorrowing(db)
      .then(util.deleteAllUsers.bind(null, db))
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  // close connection to database
  after(function() {
    db.disconnect();
  });
});
