var promise = require("bluebird");
var moduleExtensions = require("./module-extensions.js");

var options = {
  promiseLib: promise,
  capTX: true,
  extend: function() {
    moduleExtensions(this, pgp);
  }
};

var pgp = require("pg-promise")(options);

module.exports = function(connectionObject) {
  var db = pgp(connectionObject);
  return db;
};
