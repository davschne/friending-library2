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

// database instances
var db_admin;
var db;

describe('db.js', function() {

  describe('Constructor', function() {
    it('should connect to a running Postgres server and return a connection instance', function() {
      db_admin = new DB(PG_ADMIN_URI);
      expect(db_admin).to.exist;
    });
    // further tests for async functions generated from SQL files?
  });

  describe('#createDBUser', function() {
    it('should create a Postgres user/role', function(done) {
      db_admin.createDBUser(TEST_USER, TEST_USER_PW)
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        done();
      });
    });
  });

  describe('#createDatabase', function() {
    it('should create a Postgres database', function(done) {
      db_admin.createDatabase(
        TEST_DATABASE,
        PG_ADMIN_USER,
        TEST_TEMPLATE
      )
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        db_admin.disconnect(); // disconnect
        done();
      });
    });
  });

  describe('#setupDatabase', function() {
    // connect to the new database and set it up
    before(function() {
      db = new DB(PG_TEST_URI);
    });
    it('should create the database tables', function(done) {
      db.setupDatabase()
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        db.disconnect(); // disconnect
        done();
      });
    });
  });
});
