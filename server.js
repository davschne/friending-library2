var PORT      = process.env.PORT || 3000;

var express = require('express');
var app     = express();
var DB      = require('./lib/db/pgp');
var Redis   = require('ioredis');

var login   = require('./lib/login.js');

// Create database interfaces
var redis = new Redis(login.redis.prod.URI);
var db    = new DB(login.pg.prod);

// Middleware
var bodyParser   = require('body-parser');
var passport     = require('passport');
var authenticate = require('./lib/middleware/auth-bearer')(redis, passport);
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(passport.initialize());

// Handler utility
var handle = require('./lib/handle.js');

// Routing
var rootRouter  = express.Router();
var authRouter  = express.Router();
var selfRouter  = express.Router();
var booksRouter = express.Router();
var transRouter = express.Router();

require("./routes/root-routes")(rootRouter, redis, handle, authenticate);
require("./routes/auth-routes")(authRouter, db, redis, handle, passport);
require("./routes/self-routes")(selfRouter, db, redis, handle);
require("./routes/books-routes")(booksRouter, db, handle);
require("./routes/trans-routes")(transRouter, db, handle);

app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/api/self", authenticate, selfRouter);
app.use("/api/books", authenticate, booksRouter);
app.use("/api/trans", authenticate, transRouter);

redis
.on("connect", function() {
  console.log("Connected to Redis server");
})
.on("error", function(err) {
  console.log("Couldn't connect to Redis server");
  console.error(err);
});

app.listen(PORT, function() {
  // console.log("Server listening on port " + PORT);
  console.log("Server ready");
});

process.on("exit", function() {
  redis.disconnect();
  db.disconnect();
});
