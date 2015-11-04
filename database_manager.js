var promise = require('bluebird');
var pgp     = require('pg-promise')({ promiseLib: promise });
var fs      = require('fs');

// COMMAND-LINE ARGUMENTS :
//
// node database_manager <connection string> <path to SQL script>
//
//   connection string as : postgres://user:password@127.0.0.1:port/database
//

var cnstring = process.argv[2];
var script   = fs.readFileSync(process.argv[3], { encoding: 'utf8' });

// Create database interface
var pg    = pgp(cnstring);

// Some queries can't run inside a transaction block,
// like CREATE DATABASE, DROP DATABASE.
// Write code to detect transactions (BEGIN; ... COMMIT;).
// Execute such blocks as transaction, otherwise execute as separate queries.
// Use RegEx?

function splitSQL(sql) {
  // remove comments? -- until \n
  // split on ;
  // remove any empty element (prob at the end)
  // add semicolons to the end of each element
  sql = sql.split(";");
  var output = [];
  for (var i = 0; i < sql.length; i++) {
    if (sql[i] !== "\n") {
      output.push(sql[i] + ";");
    }
  }
  return output;
}

script = splitSQL(script);
console.log(script);

pg.tx(function() {
  var queries = [];
  for (var i = 0; i < script.length; i++) {
    queries[i] = this.query(script[i]);
  }
  return this.batch(queries);
})
.then(function(res) {
  console.log(res);
})
.catch(function(err) {
  console.error(err);
});

process.on("exit", function() {
  pgp.end();
});
