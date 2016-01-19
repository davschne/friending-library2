var chai = require("chai");
var expect = chai.expect;

var DB       = require('../lib/db.js');
var LOGIN    = require('./login.json');
var testData = require('../lib/test-data.js');

var PG_ADMIN_URI  = 'postgres://' +
                    LOGIN.ADMIN_USER + ':' +
                    LOGIN.ADMIN_PW +
                    '@' + LOGIN.ADDRESS + '/' +
                    LOGIN.DEFAULT_DB;

var PG_TEST_URI = 'postgres://' +
                  LOGIN.TEST_USER + ':' +
                  LOGIN.TEST_USER_PW +
                  '@' + LOGIN.ADDRESS + '/' +
                  LOGIN.TEST_DB;

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
      db_admin.createDBUser(LOGIN.TEST_USER, LOGIN.TEST_USER_PW)
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        done();
      });
    });
  });

  describe('#createDatabase', function() {
    it('should create a Postgres database', function(done) {
      db_admin.createDatabase(
        LOGIN.TEST_DB,
        LOGIN.TEST_USER,
        LOGIN.TEST_TEMPLATE
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
