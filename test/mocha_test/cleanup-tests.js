var chai = require("chai");
var expect = chai.expect;

var DB       = require('../../lib/db/pgp.js');
var config   = require('../../config.js');
var testData = require('../../lib/test/test-data.js');

// database instance
var db;

describe('db.js', function() {

  before(function() {
    db_admin = new DB(config.pg.admin);
  });

  describe('#dropDatabase', function() {
    it('should drop a Postgres database', function(done) {
      db_admin.dropDatabase(config.pg.test.database)
      .then(function(res) {
        expect(res).to.exist; // returns a response object
        done();
      });
    });
  });

  describe('#dropDBUser', function() {
    it('should drop a Postgres user/role', function(done) {
      db_admin.dropDBUser(config.pg.test.user)
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
