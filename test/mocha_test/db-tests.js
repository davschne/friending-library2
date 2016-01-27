/* jshint expr: true */

var chai = require("chai");
var expect = chai.expect;
var Promise = require("bluebird");

var DB       = require('../../lib/db/pgp.js');
var login    = require('../../lib/login.js');
var util     = require('../../lib/test/test-util.js');
var testData = require('../../lib/test/test-data.js');

// database instance
var db;

describe('db.js', function() {

  // get database connection instance
  before(function() {
    db = new DB(login.pg.test);
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
    var ISBN = book.ISBN[13] || book.ISBN[10];

    // setup: create user to own the copy
    before(function(done) {
      util.insertUser(db, user)
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
        console.log("res:", res);
        expect(res).to.exist;
        expect(res[0]).to.have.property("copyid");
        expect(res[0].copyid).to.be.a("number");
        done();
      });
    });

    it("should create a tuple in the Copies table", function(done) {
      db.query("SELECT ownerid FROM Copies WHERE ownerid=$1 AND isbn=$2;", [user.uid, ISBN])
      .then(function(res) {
        expect(res[0].ownerid).to.equal(user.uid.toString());
        done();
      });
    });

    it("should create a tuple in the Books table if it doesn't already exist", function(done) {
      db.query("SELECT isbn FROM Books WHERE isbn=$1;", [ISBN])
      .then(function(res) {
        expect(res[0].isbn).to.equal(ISBN);
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
    var ISBN = book.ISBN[13] || book.ISBN[10];
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

  describe("#getOwnBooks", function() {

    var user = util.rand(testData.users);
    var books = testData.books;

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
      .then(function() {
        // insert three Copies tuples (incl. two duplicates)
        var copies = [books[0], books[0], books[1]];
        // build chain of Promises
        return copies.reduce(function(seq, book) {
          return seq.then(function() {
            return util.insertCopy(db, book, user);
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
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(function() {
        done();
      });
    });
  });

  describe("#createBookRequest", function() {

    var owner = testData.users[0];
    var requester = testData.users[1];
    var book = util.rand(testData.books);
    var ISBN = book.ISBN[13] || book.ISBN[10];
    var copyid;

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
      db.createBookRequest(requester.uid, copyid)
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
    var ISBN = book.ISBN[13] || book.ISBN[10];
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
    var ISBN = book.ISBN[13] || book.ISBN[10];
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
      db.checkoutBook(requester.uid, copyid)
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
    var ISBN = book.ISBN[13] || book.ISBN[10];
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
        return seq.then(util.insertBookRequest.bind(null, db, request.requester, request.copy.copyid));
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
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
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
        return seq.then(util.insertBookRequest.bind(null, db, request.requester, request.copy.copyid));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the user's outgoing book requests", function(done) {
      db.getOutgoingBookRequests(users[0].uid)
      .then(function(res) {
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
      util.deleteAllUsers(db)
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
      { borrower: users[0], copy: copies[3] }, // not in result set
      { borrower: users[1], copy: copies[1] },
      { borrower: users[2], copy: copies[0] }
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
        return seq.then(util.insertBorrowing.bind(null, db, borrowing.borrower, borrowing.copy.copyid));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the user's books currently being borrowed", function(done) {
      db.getLentBooks(users[0].uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        expect(res[0].copyid).to.equal(borrowing[1].copy.copyid);
        expect(res[0].borrowerid).to.equal(borrowing[1].borrower.uid.toString());
        expect(res[0].isbn).to.equal(borrowing[1].copy.book.ISBN[13] || borrowing[1].copy.book.ISBN[10]);
        expect(res[1].copyid).to.equal(borrowing[2].copy.copyid);
        expect(res[1].borrowerid).to.equal(borrowing[2].borrower.uid.toString());
        expect(res[1].isbn).to.equal(borrowing[2].copy.book.ISBN[13] || borrowing[2].copy.book.ISBN[10]);
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
      { borrower: users[0], copy: copies[2] },
      { borrower: users[0], copy: copies[3] },
      { borrower: users[3], copy: copies[1] } // not in result set
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
        return seq.then(util.insertBorrowing.bind(null, db, borrowing.borrower, borrowing.copy.copyid));
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of tuples of the books the user is currently borrowing", function(done) {
      db.getBorrowedBooks(users[0].uid)
      .then(function(res) {
        expect(res).to.be.an.instanceof(Array);
        expect(res).to.have.length(2);
        expect(res[0].copyid).to.equal(borrowing[0].copy.copyid);
        expect(res[0].ownerid).to.equal(borrowing[0].copy.owner.uid.toString());
        expect(res[0].isbn).to.equal(borrowing[0].copy.book.ISBN[13] || borrowing[0].copy.book.ISBN[10]);
        expect(res[1].copyid).to.equal(borrowing[1].copy.copyid);
        expect(res[1].ownerid).to.equal(borrowing[1].copy.owner.uid.toString());
        expect(res[1].isbn).to.equal(borrowing[1].copy.book.ISBN[13] || borrowing[1].copy.book.ISBN[10]);
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
        expect(res[0].isbn).to.equal(copies[3].book.ISBN[13] || copies[3].book.ISBN[10]);
        expect(res[0]).to.have.property("title");
        expect(res[0]).to.have.property("subtitle");
        expect(res[0]).to.have.property("authors");
        expect(res[0]).to.have.property("categories");
        expect(res[0]).to.have.property("publisher");
        expect(res[0]).to.have.property("publisheddate");
        expect(res[0]).to.have.property("description");
        expect(res[0]).to.have.property("pagecount");
        expect(res[0]).to.have.property("language");
        expect(res[0]).to.have.property("imagelink");
        expect(res[0]).to.have.property("imagelinksmall");
        expect(res[0].copyid).to.equal(copies[3].copyid);
        expect(res[0].ownerid).to.equal(copies[3].owner.uid.toString());
        expect(res[0].owner_display_name).to.equal(copies[3].owner.display_name);
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

  // close connection to database
  after(function() {
    db.disconnect();
  });
});
