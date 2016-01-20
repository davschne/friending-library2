/* jshint expr: true */

var cp   = require("child_process");
var spawn = cp.spawn;
var chai = require("chai");
chai.use(require("chai-http"));
var expect = chai.expect;

var DB       = require('../lib/db.js');
var Redis    = require('ioredis');
var login    = require('../lib/login.json');
var util     = require('../lib/test-util.js');
var testData = require('../lib/test-data.js');

var PG_TEST_URI = 'postgres://' +
                  login.TEST_USER + ':' +
                  login.TEST_USER_PW +
                  '@' + login.ADDRESS + '/' +
                  login.TEST_DB;
var REDIS_TEST_URI = login.REDIS_TEST_URI;
var PORT = process.env.PORT || 3000;
var url = "localhost:" + PORT;

var app;
// var app = require("../server.js");

// database instances
var db;
var redis;

describe("self-routes.js", function() {

  before(function(done) {
    // get database connection instances
    db    = new DB(PG_TEST_URI);
    redis = new Redis(REDIS_TEST_URI);
    // run server as child process
    app = spawn("node", ["server.js"],
      {
        env: {
          PATH: process.env.PATH,
          PORT: PORT,
          PG_URI: PG_TEST_URI,
          REDIS_URI: REDIS_TEST_URI
        }
      }
    );
    // wait for server to start before proceeding
    app.stdout.on("data", function(data) {
      var out = data.toString();
      // console.log("server.js:", out);            // PRINT STDOUT
      if (out === "Server ready\n") done();
    });
  });

  describe("/api/self", function() {

    xdescribe("GET", function() {

      // before(function(done) {});

      it("should return an existent User as JSON, fully populated", function(done) {
        chai.request(url)
          .get("/api/self")
          // .set("Authorization", "Bearer " + testUsers[0].access_token)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            // expect(res.body._id).to.eql(testUsers[0]._id);
            // expect(res.body.books.length).to.eql(1);
            // expect(res.body.borrowing.length).to.eql(1);
            // expect(res.body.requests.length).to.eql(1);
            done();
          });
      });

      // after(function(done) {});
    });

    describe("DELETE", function() {

      var user1 = testData.users[0];
      var user2 = testData.users[1];

      // setup: create the user, set access_tokens in Redis
      before(function(done) {
        util.insertUser(db, user1)
        .then(function() {
          return redis.set(user1.access_token, user1.uid);
        })
        .then(function() {
          return redis.set(user2.access_token, user2.uid);
        })
        .then(done.bind(null, null));
      });

      describe("on success:", function() {

        it("should return a response object with status 200", function(done) {
          chai.request(url)
          .del("/api/self")
          .set("Authorization", "Bearer " + user1.access_token)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
          });
        });

        it("should delete the user's access token", function(done) {
          redis.get(user1.access_token)
          .then(function(res) {
            expect(res).to.be.null;
            done();
          });
        });
      });

      describe("on failure (user not found):", function() {
        it("should return a response object with status 404", function(done) {
          chai.request(url)
          .del("/api/self")
          .set("Authorization", "Bearer " + user2.access_token)
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res).to.be.json;
            expect(res).to.have.status(404);
            done();
          });
        });
      });

      after(function(done) {
        redis.del(user2.access_token)
        .then(done.bind(null, null));
      });
    });
  });

  xdescribe("/api/self/books", function() {

    describe("GET", function() {

      // should this return books that are borrowed or requested?

      before(function(done) {

      });

      it("should return an array of the user's books as JSON with 'request' and 'borrower' fields populated", function(done) {
        chai.request(url)
        .get("/api/self/books")
        .set("Authorization", "Bearer " + testUsers[0].access_token)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("array");
          expect(res.body[0].borrower.displayName).to.equal(testUsers[1].displayName);
          expect(res.body[0].request.displayName).to.equal(testUsers[1].displayName);
          done();
        });
      });

      after(function(done) {

      });
    });
  });

  after(function() {
    redis.disconnect();
    db.disconnect();
    app.kill();
  });
});

