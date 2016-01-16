var chai = require("chai");
var expect = chai.expect;

var DB = require('../lib/db.js');

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
var db;

describe('db.js', function() {

  before(function() {
    db_admin = new DB(PG_ADMIN_URI);
  });

  describe('#dropDatabase', function() {
    it('should drop a Postgres database', function(done) {
      db_admin.dropDatabase(TEST_DATABASE)
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        done();
      });
    });
  });

  describe('#dropDBUser', function() {
    it('should drop a Postgres user/role', function(done) {
      db_admin.dropDBUser(TEST_USER)
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        done();
      });
    });
  });

  after(function() {
    db_admin.disconnect();
  });
});
