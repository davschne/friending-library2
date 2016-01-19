/* jshint expr: true */

var cp   = require("child_process");
var spawn = cp.spawn;
var chai = require("chai");
chai.use(require("chai-http"));
var expect = chai.expect;

var DB       = require('../lib/db.js');
var Redis    = require('ioredis');
var login    = require('./login.json');
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
      // console.log("data:", out);
      if (out === "Server ready\n") done();
    });
  });

  describe("/api/self", function() {


    describe("GET", function() {

      // before(function(done) {

      // });

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

      // after(function(done) {

      // });
    });

    describe("DELETE", function() {

      var user = util.rand(testData.users);

      // setup: create the user
      // before(function(done) {
      //   util.insertUser(db, user)
      //   .then(done.bind(null, null));
      // });

      it("should return a response object with status 200", function(done) {
        chai.request(url)
        .del("/api/self")
        // .set("Authorization", "Bearer " + testUsers[0].access_token)
        .end(function(err, res) {
          // console.error(err);
          expect(err).to.be.null;
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          done();
        });
      });
    });

  });

  after(function() {
    redis.disconnect();
    db.disconnect();
    app.kill();
  });
});

// describe("/api/self/books", function() {

//   before(function(done) {
//     User.create(testUsers[0])
//       .then(function() {
//         return User.create(testUsers[1]);
//       }, function(err) { throw err; })
//       .then(function() {
//         testBooks[3].owner = testUsers[0]._id;
//         testBooks[3].borrower = testUsers[1]._id;
//         testBooks[3].request = testUsers[1]._id;
//         return Book.create(testBooks[3]);
//       }, function(err) { throw err; })
//       .then(function() {
//         done();
//       }, function(err) { throw err; });
//     });

//   describe("GET", function() {
//     it("should return an array of the user's books as JSON with 'request' and 'borrower' fields populated", function(done) {
//       chai.request(url)
//         .get("/api/self/books")
//         .set("Authorization", "Bearer " + testUsers[0].access_token)
//         .end(function(err, res) {
//           expect(err).to.be.null;
//           expect(res).to.have.status(200);
//           expect(res).to.be.json;
//           expect(res.body).to.be.an("array");
//           expect(res.body[0].borrower.displayName).to.equal(testUsers[1].displayName);
//           expect(res.body[0].request.displayName).to.equal(testUsers[1].displayName);
//           done();
//         });
//       });
//     });

//   after(function(done) {
//     User.findByIdAndRemove(testUsers[0]._id)
//       .exec()
//       .then(function() {
//         return User.findByIdAndRemove(testUsers[1]._id);
//       }, function(err) { throw err; })
//       .then(function() {
//         return Book.remove({owner: testUsers[0]._id});
//       }, function(err) { throw err; })
//       .then(function() {
//         done();
//       }, function(err) { throw err; });
//   });
// });
