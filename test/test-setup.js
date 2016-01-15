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

// database instances
var pg_admin;
var pg;

describe('db-util.js', function() {

  describe('#getInstance', function() {
    it('should connect to a running Postgres server and return a connection instance', function() {
      pg_admin = dbUtil.getInstance(PG_ADMIN_URI);
      expect(pg_admin).to.exist;
    });
    // further tests for async functions generated from SQL files?
  });

  describe('#createDBUser', function() {
    it('should create a Postgres user/role', function(done) {
      dbUtil.createDBUser(pg_admin, TEST_USER, TEST_USER_PW)
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

  describe('#createDatabase', function() {
    it('should create a Postgres database', function(done) {
      dbUtil.createDatabase(
        pg_admin,
        TEST_DATABASE,
        PG_ADMIN_USER,
        TEST_TEMPLATE
      )
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

  describe('#setupDatabase', function() {
    before(function() {
      pg = dbUtil.getInstance(PG_TEST_URI);
    });
    it('should create the database tables', function(done) {
      dbUtil.setupDatabase(pg)
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

  after(function() {
    pg_admin.end();
  });
});
