var Promise = require("bluebird");
var DB      = require("../db/pgp.js");
var Redis   = require("ioredis");

var config  = require("../../config.js");
var util    = require("./test-util");
var data    = require("./test-data");

// Create database interfaces

// NB: using production database for now, but probably would be better to find a convenient way to test the entire stack using the test database
var redis = new Redis(config.redis.prod.URI);
var db    = new DB(config.pg.prod);

var users = data.users;
var books = data.books;
var copies = [
  // user 0's copies:
  { owner: users[0], book: books[0] },  // 0
  { owner: users[0], book: books[1] },  // 1
  { owner: users[0], book: books[2] },  // 2
  { owner: users[0], book: books[3] },  // 3
  { owner: users[0], book: books[4] },  // 4
  { owner: users[0], book: books[5] },  // 5
  // other users' copies:
  { owner: users[1], book: books[6] },  // 6
  { owner: users[1], book: books[7] },  // 7
  { owner: users[2], book: books[8] },  // 8
  { owner: users[2], book: books[9] },  // 9
  { owner: users[3], book: books[10] }, // 10
  { owner: users[3], book: books[11] }, // 11
  { owner: users[4], book: books[12] }, // 12
  { owner: users[4], book: books[12] }, // 13
];

var bookrequests = [
  // user 0's incoming
  { copy: copies[2], requester: users[1], request_date: new Date() },
  { copy: copies[3], requester: users[2], request_date: new Date() },
  // user 0's outgoing
  { copy: copies[6], requester: users[0], request_date: new Date() },
  { copy: copies[7], requester: users[0], request_date: new Date() },
];

var borrowing = [
  // user 0's lent
  { copy: copies[4], borrower: users[3], checkout_date: new Date() },
  { copy: copies[5], borrower: users[4], checkout_date: new Date() },
  // user 0's borrowed
  { copy: copies[8], borrower: users[0], checkout_date: new Date() },
  { copy: copies[9], borrower: users[0], checkout_date: new Date() },
];

// setup database
util.createDBState(db, {
  users        : users,
  books        : books,
  copies       : copies,
  bookrequests : bookrequests,
  borrowing    : borrowing
})
.then(function() {
  console.log("Tuples created");
})
// insert access tokens
.then(function() {
  return util.setUserTokens(redis, users);
})
.then(function() {
  console.log("Access tokens set");
})
.catch(function(err) {
  console.error(err, err.stack);
})
.finally(function() {
  db.disconnect();
  redis.disconnect();
  process.exit();
});
