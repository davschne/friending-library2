var PORT      = process.env.PORT || 3000;
var PG_URI    = process.env.PG_URI
  || 'postgres://friending_library_user:test@127.0.0.1:5432/friending_library';
var REDIS_URI = process.env.REDIS_URI
  || 'redis://:authpassword@127.0.0.1:6379/0';

var express      = require('express');
var passport     = require('passport');
var Redis        = require('ioredis');

var dbUtil = require('./lib/db-util');

var app   = express();

// Create database interfaces
var redis = new Redis(REDIS_URI);
var pg    = dbUtil.get_instance(PG_URI);

// Middleware
var bodyParser   = require('body-parser');
var authenticate = require('./middleware/auth-bearer')(redis);
// var dbs          = require('./middleware/dbs');

app.use(passport.initialize());
app.use(express.static("public"));
app.use(bodyParser.json());
// app.use(dbs(pg, redis));

// redis.ping().then(function(result) {
//   console.log(result);
// });

// pg.query("select * from test").then(function(data) {
//   console.log(data);
// })
// .catch(function(err) { console.log(err); });

var authRouter  = express.Router();
var selfRouter  = express.Router();
var booksRouter = express.Router();
var transRouter = express.Router();
var rootRouter  = express.Router();

require("./routes/auth-routes")(authRouter, pg, redis);
// require("./routes/self-routes")(selfRouter);
// require("./routes/books-routes")(booksRouter);
// require("./routes/trans-routes")(transRouter);
require("./routes/root-routes")(rootRouter, redis);

app.use("/auth", authRouter);

app.post("/test", authenticate, function(req, res) {
  console.log(req.user);
  res.json({msg: "done"});
});

app.use("/api/self", authenticate, selfRouter);
app.use("/api/books", authenticate, booksRouter);
app.use("/api/trans", authenticate, transRouter);
app.use("/", rootRouter);

app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});

redis
  .on("connect", function() {
    console.log("Connected to Redis server");
  })
  .on("error", function(err) {
    console.log("Couldn't connect to Redis server");
    console.error(err);
  });

// pg.test(function(err, res) {
//   if (!err) {
//     pg.users.find(200, function(err, res) {
//       console.log(res);
//     })
//   }
// })

process.on("exit", function() {
  redis.disconnect();
  dbUtil.disconnect();
});
