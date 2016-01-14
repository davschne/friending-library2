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
        done();
      })
      .catch(function(err) {
        expect(err).to.not.exist; // assertion fails if error
        done();
      });
    });
  });
});
