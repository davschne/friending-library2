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

var INSERT_USER = "INSERT INTO Users (uID, display_name) SELECT $1, $2 WHERE NOT EXISTS (SELECT uID FROM Users WHERE uID = $1);";

var DELETE_USER = "DELETE FROM Users WHERE uid = $1;";

var INSERT_BOOK = "INSERT INTO Books (ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall) SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 WHERE NOT EXISTS (SELECT ISBN FROM Books WHERE ISBN = CAST($1 AS varchar));"

var DELETE_BOOK = "DELETE FROM Books WHERE ISBN = $1;";

var INSERT_COPY = "INSERT INTO Copies (ISBN, ownerID) VALUES ($1, $2);";

// var DELETE_COPY = "DELETE FROM Copies WHERE copyid = $1;";

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
      db.findOrCreateUser(
        user.uid,
        user.display_name
      )
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should create a tuple in the Users table if it doesn't already exist", function(done) {
      db.run("SELECT uid FROM Users WHERE uid=" + user.uid + ";")
      .then(function(res) {
        expect(res[0].uid).to.equal(user.uid.toString());
        done();
      });
    });

    // cleanup: delete the user
    after(function(done) {
      db.run(DELETE_USER, [user.uid])
      .then(function(res) {
        done();
      });
    })
  });

  describe('#deleteUser', function() {

    var user = rand(testData.users);

    // setup: create the user
    before(function(done) {
      db.run(INSERT_USER, [user.uid, user.display_name])
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
      db.run("SELECT uid FROM Users WHERE uid=" + user.uid + ";")
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
      db.run(INSERT_USER, [user.uid, user.display_name])
      .then(function(res) {
        done();
      });
    });

    it("should return a response object", function(done) {
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
        done();
      });
    });

    it("should create a tuple in the Copies table", function(done) {
      db.run("SELECT ownerid FROM Copies WHERE ownerid=" + user.uid + " AND isbn=\'" + ISBN + "\';")
      .then(function(res) {
        expect(res[0].ownerid).to.equal(user.uid.toString());
        done();
      });
    });

    it("should create a tuple in the Books table if it doesn't already exist", function(done) {
      db.run("SELECT isbn FROM Books WHERE isbn=\'" + ISBN + "\';")
      .then(function(res) {
        expect(res[0].isbn).to.equal(ISBN);
        done();
      });
    });

    // cleanup: delete user and book (cascade should delete the copy)
    after(function(done) {
      db.run(DELETE_USER, [user.uid])
      .then(function() {
        return db.run(DELETE_BOOK, [ISBN]);
      })
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
      db.run(INSERT_USER, [user.uid, user.display_name])
      .then(function() {
        return db.run(INSERT_BOOK, [
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
        ]);
      })
      .then(function() {
        return db.run(INSERT_COPY, [ISBN, user.uid]);
      })
      .then(function() {
        return db.run("SELECT copyid FROM Copies WHERE ISBN=$1 AND ownerid=$2", [ISBN, user.uid]);
      })
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
      db.run(DELETE_USER, [user.uid])
      .then(function() {
        return db.run(DELETE_BOOK, [ISBN]);
      })
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
      db.run(INSERT_USER, [user.uid, user.display_name])
      // insert four Books tuples
      .then(function() {
        // build chain of Promises
        return books.slice(0, 4).reduce(function(seq, book) {
          return seq.then(function() {
            return db.run(INSERT_BOOK, [
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
          });
        }, Promise.resolve());
      })
      .then(function() {
        // insert three Copies tuples (incl. two duplicates)
        var copies = [books[0], books[0], books[1]];
        // build chain of Promises
        return copies.reduce(function(seq, book) {
          return seq.then(function() {
            return db.run(INSERT_COPY, [book.ISBN[13] || book.ISBN[10], user.uid]);
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
      db.run("DELETE FROM USERS;")
      .then(function() {
        return db.run("DELETE FROM BOOKS;");
      })
      .then(function() {
        done();
      });
    });
  });

  // close connection to database
  after(function() {
    db.disconnect();
  });
});
