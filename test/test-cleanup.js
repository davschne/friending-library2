var chai = require("chai");
var expect = chai.expect;

var dbUtil = require('../lib/db-util.js');

var PG_ADDRESS    = '127.0.0.1:5432';
var PG_ADMIN_USER = 'postgres';
var PG_ADMIN_PW   = '';
var PG_DEFAULT_DB = 'template1';
var PG_ADMIN_URI  = 'postgres://' +
                    PG_ADMIN_USER + ':' +
                    PG_ADMIN_PW +
                    '@' + PG_ADDRESS + '/' +
                    PG_DEFAULT_DB;
var TEST_USER     = 'friending_library_tester';
var TEST_USER_PW  = 'test';
var TEST_DATABASE = 'friending_library_test';
var TEST_TEMPLATE = 'template1';
var PG_TEST_URI   = 'postgres://' +
                    PG_ADMIN_USER + ':' +
                    PG_ADMIN_PW +
                    '@' + PG_ADDRESS + '/' +
                    TEST_DATABASE;

// database instance
var pg_admin;

describe('db-util.js', function() {

  before(function() {
    pg_admin = dbUtil.getInstance(PG_ADMIN_URI);
  });

  describe('#dropDatabase', function() {
    it("should drop a Postgres database", function(done) {
      // set longer timeout
      // this.timeout(5000);
      // setTimeout(done, 5000);
      dbUtil.dropDatabase(pg_admin, TEST_DATABASE)
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

  describe('#dropUser', function() {
    it("should drop a Postgres user/role", function(done) {
      dbUtil.dropUser(pg_admin, TEST_USER)
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
