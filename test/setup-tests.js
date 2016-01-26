var chai = require("chai");
var expect = chai.expect;

var DB       = require('../lib/db/pgp.js');
var login    = require('../lib/login.js');
var testData = require('../lib/test/test-data.js');

// database instances
var db_admin;
var db;

describe('db.js', function() {

  describe('Constructor', function() {
    it('should connect to a running Postgres server and return a connection instance', function() {
      db_admin = DB(login.pg.admin);
      expect(db_admin).to.exist;
    });
    // further tests for async functions generated from SQL files?
  });

  describe('#createDBUser', function() {
    it('should create a Postgres user/role', function(done) {
      db_admin.createDBUser(login.pg.test.user, login.pg.test.password)
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        done();
      });
    });
  });

  describe('#createDatabase', function() {
    it('should create a Postgres database', function(done) {
      db_admin.createDatabase(
        login.pg.test.database,
        login.pg.test.user,
        login.pg.template
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
      db = new DB(login.pg.test);
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
