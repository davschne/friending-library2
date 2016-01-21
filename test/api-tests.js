/* jshint expr: true */

var LOG_SERVER_OUTPUT = true; // enable logging of child process?

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
      // PRINT STDOUT
      if (LOG_SERVER_OUTPUT) console.log("server.js:", out);
      if (out === "Server ready\n") done();
    });
    app.stderr.on("data", function(data) {
      if (LOG_SERVER_OUTPUT) console.error("server.js:", data.toString());
    });
  });

  describe("/api/self", function() {

    describe("DELETE", function() {

      var users = testData.users;
      var book = util.rand(testData.books);
      var copy = { book: book, owner: users[1] }

      // setup: create the user, set access_tokens in Redis
      before(function(done) {
        // insert users 0, 1, 2
        users.slice(0, 3).reduce(function(seq, user) {
          return seq.then(util.insertUser.bind(null, db, user));
        }, Promise.resolve())
        // set access tokens in Redis for all users
        .then(function() {
          return users.reduce(function(seq, user) {
            return seq.then(function() {
              return redis.set(user.access_token, user.uid);
            });
          }, Promise.resolve());
        })
        // insert book
        .then(util.insertBook.bind(null, db, book))
        // insert copy
        .then(util.insertCopy.bind(null, db, copy.book, copy.owner))
        // store copyid and insert Borrowing (users[2] borrowing)
        .then(function(res) {
          copy.copyid = res[0].copyid;
          return util.insertBorrowing(db, users[2], copy.copyid);
        })
        .then(done.bind(null, null));
      });

      describe("on success:", function() {

        it("should return a response object with status 200", function(done) {
          chai.request(url)
          .del("/api/self")
          .set("Authorization", "Bearer " + users[0].access_token)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            done();
          });
        });

        it("should delete the user's access token", function(done) {
          redis.get(users[0].access_token)
          .then(function(res) {
            expect(res).to.be.null;
            done();
          });
        });
      });

      describe("on failure:", function() {
        describe("(user not found):", function() {
          it("should return a response object with status 404", function(done) {
            chai.request(url)
            .del("/api/self")
            .set("Authorization", "Bearer " + users[3].access_token)
            .end(function(err, res) {
              expect(err).to.be.null
              expect(res).to.be.json;
              expect(res).to.have.status(404);
              done();
            });
          });
        });
        describe("(user currently borrowing one or more books):", function() {
          it("should return a response object with status 403", function(done) {
            chai.request(url)
            .del("/api/self")
            .set("Authorization", "Bearer " + users[2].access_token)
            .end(function(err, res) {
              // console.log(res);
              expect(err).to.be.null
              expect(res).to.be.json;
              expect(res).to.have.status(403);
              done();
            });
          });
        });
      });

      after(function(done) {
        users.slice(1, 4).reduce(function(seq, user) {
          return redis.del(user.access_token);
        }, Promise.resolve())
        .then(util.deleteAllBorrowing.bind(null, db))
        .then(util.deleteAllUsers.bind(null, db))
        .then(util.deleteAllBooks.bind(null, db))
        .then(done.bind(null, null));
      });
    });
  });

  describe("/api/self/books GET", function() {

    var user = testData.users[0];
    var books = testData.books;
    var copies = [];
    books.forEach(function(book, index) {
      copies.push({ book: books[index] });
    });

    before(function(done) {
      // insert user
      util.insertUser(db, user)
      // set access tokens
      .then(function() {
        return redis.set(user.access_token, user.uid);
      })
      // insert books
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert copies
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(util.insertCopy.bind(null, db, copy.book, user))
        .then(function(res) {
          copies[index].copyid = res[0].copyid;
        });
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of the user's books as JSON with status 200", function(done) {
      chai.request(url)
      .get("/api/self/books")
      .set("Authorization", "Bearer " + user.access_token)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(4);
        res.body.forEach(function(record) {
          expect(record).to.contain.keys(
            "isbn",
            "title",
            "subtitle",
            "authors",
            "categories",
            "publisher",
            "publisheddate",
            "description",
            "pagecount",
            "language",
            "imagelink",
            "imagelinksmall",
            "copyids"
          );
        });
        done();
      });
    });

    after(function(done) {
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(function() {
        redis.del(user.access_token);
      })
      .then(done.bind(null, null));
    });
  });

  describe("/api/self/book_requests/incoming GET", function() {

    var users = testData.users.slice(0, 2);
    var books = testData.books.slice(0, 2);
    var copies = [];
    books.forEach(function(book, index) {
      copies.push({ book: books[index], owner: users[0]})
    });

    before(function(done) {
      // insert users
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert access token for users[0]
      .then(function() {
        return redis.set(users[0].access_token, users[0].uid);
      })
      // insert books
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert copies
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(util.insertCopy.bind(null, db, copy.book, copy.owner))
        // store copyid and insert book request
        .then(function(res) {
          var copyid = res[0].copyid;
          copies[index].copyid = copyid;
          return util.insertBookRequest(db, users[1], copyid);
        });
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of requests for books owned by the user as JSON with status 200", function(done) {
      chai.request(url)
      .get("/api/self/book_requests/incoming")
      .set("Authorization", "Bearer " + users[0].access_token)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(2);
        res.body.forEach(function(record) {
          expect(record).to.contain.keys(
            "isbn",
            "title",
            "subtitle",
            "authors",
            "categories",
            "publisher",
            "publisheddate",
            "description",
            "pagecount",
            "language",
            "imagelink",
            "imagelinksmall",
            "copyid",
            "requesterid",
            "requester_display_name",
            "request_date"
          );
        });
        done();
      });
    });

    after(function(done) {
      redis.del(users[0].access_token)
      .then(util.deleteAllUsers.bind(null, db))
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("/api/self/book_requests/outgoing GET", function() {

    var users = testData.users.slice(0, 2);
    var books = testData.books.slice(0, 2);
    var copies = [];
    books.forEach(function(book, index) {
      copies.push({ book: books[index], owner: users[0]})
    });

    before(function(done) {
      // insert users
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert access token for users[1]
      .then(function() {
        return redis.set(users[1].access_token, users[1].uid);
      })
      // insert books
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert copies
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(util.insertCopy.bind(null, db, copy.book, copy.owner))
        // store copyid and insert book request
        .then(function(res) {
          var copyid = res[0].copyid;
          copies[index].copyid = copyid;
          return util.insertBookRequest(db, users[1], copyid);
        });
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of books requested by the user as JSON with status 200", function(done) {
      chai.request(url)
      .get("/api/self/book_requests/outgoing")
      .set("Authorization", "Bearer " + users[1].access_token)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(2);
        res.body.forEach(function(record) {
          expect(record).to.contain.keys(
            "isbn",
            "title",
            "subtitle",
            "authors",
            "categories",
            "publisher",
            "publisheddate",
            "description",
            "pagecount",
            "language",
            "imagelink",
            "imagelinksmall",
            "copyid",
            "ownerid",
            "owner_display_name",
            "request_date"
          );
        });
        done();
      });
    });

    after(function(done) {
      redis.del(users[1].access_token)
      .then(util.deleteAllUsers.bind(null, db))
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("/api/self/books_lent GET", function() {

    var users = testData.users.slice(0, 2);
    var books = testData.books.slice(0, 2);
    var copies = [];
    books.forEach(function(book, index) {
      copies.push({ book: books[index], owner: users[0]})
    });

    before(function(done) {
      // insert users
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert access token for users[0]
      .then(function() {
        return redis.set(users[0].access_token, users[0].uid);
      })
      // insert books
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert copies
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(util.insertCopy.bind(null, db, copy.book, copy.owner))
        // store copyid and insert Borrowing
        .then(function(res) {
          var copyid = res[0].copyid;
          copies[index].copyid = copyid;
          return util.insertBorrowing(db, users[1], copyid);
        });
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of books owned by the user that are currently lent as JSON with status 200", function(done) {
      chai.request(url)
      .get("/api/self/books_lent")
      .set("Authorization", "Bearer " + users[0].access_token)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(2);
        res.body.forEach(function(record) {
          expect(record).to.contain.keys(
            "isbn",
            "title",
            "subtitle",
            "authors",
            "categories",
            "publisher",
            "publisheddate",
            "description",
            "pagecount",
            "language",
            "imagelink",
            "imagelinksmall",
            "copyid",
            "borrowerid",
            "borrower_display_name",
            "checkout_date"
          );
        });
        done();
      });
    });

    after(function(done) {
      redis.del(users[0].access_token)
      .then(util.deleteAllBorrowing.bind(null, db))
      .then(util.deleteAllUsers.bind(null, db))
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });

  describe("/api/self/books_borrowed GET", function() {

    var users = testData.users.slice(0, 2);
    var books = testData.books.slice(0, 2);
    var copies = [];
    books.forEach(function(book, index) {
      copies.push({ book: books[index], owner: users[0]})
    });

    before(function(done) {
      // insert users
      users.reduce(function(seq, user) {
        return seq.then(util.insertUser.bind(null, db, user));
      }, Promise.resolve())
      // insert access token for users[1]
      .then(function() {
        return redis.set(users[1].access_token, users[1].uid);
      })
      // insert books
      .then(books.reduce.bind(books, function(seq, book) {
        return seq.then(util.insertBook.bind(null, db, book));
      }, Promise.resolve()))
      // insert copies
      .then(copies.reduce.bind(copies, function(seq, copy, index) {
        return seq.then(util.insertCopy.bind(null, db, copy.book, copy.owner))
        // store copyid and insert Borrowing
        .then(function(res) {
          var copyid = res[0].copyid;
          copies[index].copyid = copyid;
          return util.insertBorrowing(db, users[1], copyid);
        });
      }, Promise.resolve()))
      .then(done.bind(null, null));
    });

    it("should return an array of books the user is currently borrowing as JSON with status 200", function(done) {
      chai.request(url)
      .get("/api/self/books_borrowed")
      .set("Authorization", "Bearer " + users[1].access_token)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(2);
        res.body.forEach(function(record) {
          expect(record).to.contain.keys(
            "isbn",
            "title",
            "subtitle",
            "authors",
            "categories",
            "publisher",
            "publisheddate",
            "description",
            "pagecount",
            "language",
            "imagelink",
            "imagelinksmall",
            "copyid",
            "ownerid",
            "owner_display_name",
            "checkout_date"
          );
        });
        done();
      });
    });

    after(function(done) {
      redis.del(users[1].access_token)
      .then(util.deleteAllBorrowing.bind(null, db))
      .then(util.deleteAllUsers.bind(null, db))
      .then(util.deleteAllBooks.bind(null, db))
      .then(done.bind(null, null));
    });
  });
});

describe("books-routes.js", function() {

  describe("/api/books POST", function() {

    var user = util.rand(testData.users);
    var book = util.rand(testData.books);

    before(function(done) {
      // insert user
      util.insertUser(db, user)
      // set access token in Redis
      .then(function() {
        return redis.set(user.access_token, user.uid);
      })
      .then(done.bind(null, null));
    });

    it("should return a JSON response object containing the copyid of the inserted copy as JSON with status 200", function(done) {
      chai.request(url)
      .post("/api/books")
      .set("Authorization", "Bearer " + user.access_token)
      .type("json")
      .send(book)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(1);
        expect(res.body[0]).to.have.property("copyid");
        done();
      });
    });

    after(function(done) {
      // delete users and books (copy will cascade), delete access token
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(function() {
        return redis.del(user.access_token);
      })
      .then(done.bind(null, null));
    });
  });

  describe("/api/books/:copyid DELETE", function() {

    var user = util.rand(testData.users);
    var book = util.rand(testData.books);
    var copyid;

    before(function(done) {
      // insert user
      util.insertUser(db, user)
      // set access token in Redis
      .then(function() {
        return redis.set(user.access_token, user.uid);
      })
      // insert book
      .then(util.insertBook.bind(null, db, book))
      // insert copy
      .then(util.insertCopy.bind(null, db, book, user))
      // store copyid
      .then(function(res) {
        copyid = res[0].copyid;
      })
      .then(done.bind(null, null));
    });

    it("should return a JSON response object with status 200", function(done) {
      chai.request(url)
      .del("/api/books/" + copyid)
      .set("Authorization", "Bearer " + user.access_token)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        done();
      });
    });

    after(function(done) {
      // delete users and books, delete access token
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(function() {
        return redis.del(user.access_token);
      })
      .then(done.bind(null, null));
    });
  });

  describe("/api/books/available GET", function() {

    var users = testData.users;
    var books = testData.books;

    before(function(done) {
      // insert users
      util.insertUser(db, users[0])
      .then(util.insertUser.bind(null, db, users[1]))
      // set access token in Redis for users[0]
      .then(function() {
        return redis.set(users[0].access_token, users[0].uid);
      })
      // insert books and copies
      .then(function() {
        return books.reduce(function(seq, book) {
          return seq.then(util.insertBook.bind(null, db, book))
            .then(util.insertCopy.bind(null, db, book, users[1]));
        }, Promise.resolve());
      })
      .then(done.bind(null, null));
    });

    it("should return a JSON array of books available to be borrowed with status 200", function(done) {
      chai.request(url)
      .get("/api/books/available")
      .set("Authorization", "Bearer " + users[0].access_token)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(4);
        res.body.forEach(function(record) {
          expect(record).to.contain.keys(
            "isbn",
            "title",
            "subtitle",
            "authors",
            "categories",
            "publisher",
            "publisheddate",
            "description",
            "pagecount",
            "language",
            "imagelink",
            "imagelinksmall",
            "copyid",
            "ownerid",
            "owner_display_name"
          );
        });
        done();
      });
    });

    after(function(done) {
      // delete users, books (copies will cascade), delete access token
      util.deleteAllUsers(db)
      .then(util.deleteAllBooks.bind(null, db))
      .then(function() {
        return redis.del(users[0].access_token);
      })
      .then(done.bind(null, null));
    });
  });

  after(function() {
    redis.disconnect();
    db.disconnect();
    app.kill();
  });
});
