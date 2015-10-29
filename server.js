var PORT      = process.env.PORT || 3000;
var PG_URI    = process.env.PG_URI
  || 'postgres://friending_library_user:test@127.0.0.1:5432/friending_library';
var REDIS_URI = process.env.REDIS_URI
  || 'redis://:authpassword@127.0.0.1:6379/0';

var express      = require('express');
var promise      = require('bluebird');
var bodyParser   = require('body-parser');
var passport     = require('passport');
var authenticate = require('./middleware/auth-bearer');
var Redis        = require('ioredis');
var pgp          = require('pg-promise')({ promiseLib: promise });

var app   = express();

var redis = new Redis(REDIS_URI);
var db    = pgp(PG_URI);

redis.ping().then(function(result) {
  console.log(result);
});

db.query("select * from test").then(function(data) {
  console.log(data);
})
.catch(function(err) { console.log(err); });

// mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/friending-library", function(err) {
//   if (err) console.log(err);
//   else console.log("Opened connection to MongoDB");
// });
// var db = mongoose.connection;

var authRouter  = express.Router();
var selfRouter  = express.Router();
var booksRouter = express.Router();
var transRouter = express.Router();
var rootRouter  = express.Router();

// require("./routes/auth-routes")(authRouter);
// require("./routes/self-routes")(selfRouter);
// require("./routes/books-routes")(booksRouter);
// require("./routes/trans-routes")(transRouter);
// require("./routes/root-routes")(rootRouter);

app.use(passport.initialize());
app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/api/self", authenticate, selfRouter);
app.use("/api/books", authenticate, booksRouter);
app.use("/api/trans", authenticate, transRouter);
app.use("/", rootRouter);

app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});

process.on("exit", function() {
  redis.disconnect();
  pgp.end();
});
