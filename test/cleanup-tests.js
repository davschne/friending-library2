var chai = require("chai");
var expect = chai.expect;

var DB = require('../lib/db.js');

var DB       = require('../lib/db.js');
var LOGIN    = require('../lib/login.json');
var testData = require('../lib/test-data.js');

var PG_ADMIN_URI  = 'postgres://' +
                    LOGIN.ADMIN_USER + ':' +
                    LOGIN.ADMIN_PW +
                    '@' + LOGIN.ADDRESS + '/' +
                    LOGIN.DEFAULT_DB;

// database instance
var db;

describe('db.js', function() {

  before(function() {
    db_admin = new DB(PG_ADMIN_URI);
  });

  describe('#dropDatabase', function() {
    it('should drop a Postgres database', function(done) {
      db_admin.dropDatabase(LOGIN.TEST_DB)
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        done();
      });
    });
  });

  describe('#dropDBUser', function() {
    it('should drop a Postgres user/role', function(done) {
      db_admin.dropDBUser(LOGIN.TEST_USER)
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
