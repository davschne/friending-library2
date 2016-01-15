var chai = require("chai");
var expect = chai.expect;

var dbUtil = require('../lib/db-util.js');

var testData = require('../lib/test-data.js');

var PG_ADDRESS    = '127.0.0.1:5432';
var PG_ADMIN_USER = 'postgres';
var PG_ADMIN_PW   = '';
var TEST_DATABASE = 'friending_library_test';
var PG_TEST_URI   = 'postgres://' +
                    PG_ADMIN_USER + ':' +
                    PG_ADMIN_PW +
                    '@' + PG_ADDRESS + '/' +
                    TEST_DATABASE;

var INSERT_USER = "INSERT INTO Users (uID, display_name) SELECT $1, $2 WHERE NOT EXISTS (SELECT uID FROM Users WHERE uID = $1);";

var DELETE_USER = "DELETE FROM Users WHERE uid = $1;";

var INSERT_BOOK = "INSERT INTO Books (ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall) SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 WHERE NOT EXISTS (SELECT ISBN FROM Books WHERE ISBN = CAST($1 AS varchar));"

var DELETE_BOOK = "DELETE FROM Books WHERE ISBN = $1;";

var INSERT_COPY = "INSERT INTO Copies (ISBN, ownerID) VALUES ($1, $2);";

// var DELETE_COPY = "DELETE FROM Copies WHERE copyid = $1;";

// database instance
var pg;

describe('db-util.js', function() {

  before(function() {
    pg = dbUtil.getInstance(PG_TEST_URI);
  });

  describe('#findOrCreateUser', function() {

    var user = testData.users[0];

    it("should return a response object", function(done) {
      dbUtil.findOrCreateUser(
        pg,
        user.uid,
        user.display_name
      )
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should create a tuple in the Users table if it doesn't already exist", function(done) {
      pg.runAsync("SELECT uid FROM Users WHERE uid=" + user.uid + ";")
      .then(function(res) {
        expect(res[0].uid).to.equal(user.uid.toString());
        done();
      });
    });

    // cleanup: delete the user
    after(function(done) {
      pg.runAsync(DELETE_USER, [user.uid])
      .then(function(res) {
        done();
      });
    })
  });

  describe('#createCopy', function() {

    var user = testData.users[0];
    var book = testData.books[0];
    var ISBN = book.ISBN[13] || book.ISBN[10];

    // setup: create user to own the copy
    before(function(done) {
      pg.runAsync(INSERT_USER, [user.uid, user.display_name])
      .then(function(res) {
        done();
      });
    });

    it("should return a response object", function(done) {
      dbUtil.createCopy(
        pg,
        user.uid,
        ISBN,
        book.title,
        book.subtitle || '',
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
      pg.runAsync("SELECT ownerid FROM Copies WHERE ownerid=" + user.uid + " AND isbn=\'" + ISBN + "\';")
      .then(function(res) {
        expect(res[0].ownerid).to.equal(user.uid.toString());
        done();
      });
    });

    it("should create a tuple in the Books table if it doesn't already exist", function(done) {
      pg.runAsync("SELECT isbn FROM Books WHERE isbn=\'" + ISBN + "\';")
      .then(function(res) {
        expect(res[0].isbn).to.equal(ISBN);
        done();
      });
    });

    // cleanup: delete the user and book (cascade should delete the copy)
    after(function(done) {
      pg.runAsync(DELETE_USER, [user.uid])
      .then(function() {
        return pg.runAsync(DELETE_BOOK, [book.ISBN]);
      })
      .then(function(res) {
        done();
      });
    });
  });

  describe('#deleteUser', function() {
    var user = testData.users[0];

    // setup: create the user
    before(function(done) {
      pg.runAsync(INSERT_USER, [user.uid, user.display_name])
      .then(function(res) {
        done();
      });
    });

    it("should return a response object", function(done) {
      dbUtil.deleteUser(pg, user.uid)
      .then(function(res) {
        expect(res).to.exist;
        done();
      });
    });

    it("should delete a tuple from the Users table if it exists", function(done) {
      pg.runAsync("SELECT uid FROM Users WHERE uid=" + user.uid + ";")
      .then(function(res) {
        expect(res).to.be.empty; // expect empty array
        done();
      });
    });
  });

  after(function() {
    pg.end();
  });
});
