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
  });

  describe('#createCopy', function() {
    var user = testData.users[0];
    var book = testData.books[0];
    var ISBN = book.ISBN[13] || book.ISBN[10];
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
  });

  describe('#deleteUser', function() {
    var user = testData.users[0];
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
});
