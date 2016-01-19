var PORT      = process.env.PORT || 3000;
var PG_URI    = process.env.PG_URI
  || 'postgres://friending_library_user:test@127.0.0.1:5432/friending_library';
var REDIS_URI = process.env.REDIS_URI
  || 'redis://:authpassword@127.0.0.1:6379/0';

var express = require('express');
var app     = express();
var DB      = require('./lib/db');
var Redis   = require('ioredis');

// Create database interfaces
var redis = new Redis(REDIS_URI);
var db    = new DB(PG_URI);

// Middleware
var bodyParser   = require('body-parser');
var passport     = require('passport');
var authenticate = require('./middleware/auth-bearer')(redis);
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(passport.initialize());

// Routing
var rootRouter  = express.Router();
var authRouter  = express.Router();
var selfRouter  = express.Router();
var booksRouter = express.Router();
var transRouter = express.Router();

// require("./routes/root-routes")(rootRouter, db);
// require("./routes/auth-routes")(authRouter, db);
require("./routes/self-routes")(selfRouter, db);
// require("./routes/books-routes")(booksRouter, db);
// require("./routes/trans-routes")(transRouter, db);

// app.use("/", rootRouter);
// app.use("/auth", authRouter);
app.use("/api/self", /*authenticate,*/ selfRouter);
// app.use("/api/books", authenticate, booksRouter);
// app.use("/api/trans", authenticate, transRouter);

// redis.ping().then(function(result) {
//   console.log(result);
// });

// app.post("/test", authenticate, function(req, res) {
//   console.log(req.user);
//   res.json({msg: "done"});
// });

redis
.on("connect", function() {
  console.log("Connected to Redis server");
})
.on("error", function(err) {
  console.log("Couldn't connect to Redis server");
  console.error(err);
});

app.listen(PORT, function() {
  console.log("Server listening on port " + PORT);
  console.log("Server ready");
});

process.on("exit", function() {
  redis.disconnect();
  db.disconnect();
});
