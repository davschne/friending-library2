var chai = require("chai");
var expect = chai.expect;

var dbUtil = require('../lib/db-util.js');

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
    it("should create a tuple in the Users table if it doesn't already exist", function(done) {
      dbUtil.findOrCreateUser(pg, 12345, "Billy_Madison")
      .then(function(res) {
        expect(res).to.exist; // returns a response object
      })
      .then(function() {
        return pg.runAsync("SELECT uid FROM Users WHERE uid=12345;");
      })
      .then(function(res) {
        expect(res[0].uid).to.equal('12345'); // tuple exists in DB
        done();
      })
      .catch(function(err) {
        expect(err).to.not.exist; // assertion fails if error
        done();
      });
    });
  });

  describe('#deleteUser', function() {
    it("should delete a tuple from the Users table if it exists", function(done) {
      dbUtil.deleteUser(pg, 12345)
      .then(function(res) {
        expect(res).to.exist; // returns a response object
      })
      .then(function() {
        return pg.runAsync("SELECT uid FROM Users WHERE uid=12345;");
      })
      .then(function(res) {
        expect(res).to.be.empty; // expect empty array
        done();
      })
      .catch(function(err) {
        expect(err).to.not.exist; // assertion fails if error
        done();
      });
    });
  });
});
