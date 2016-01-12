var Promise = require('bluebird');

// PG-PROMISE LIBRARY
// var pgp     = require('pg-promise')({ promiseLib: promise });

// MASSIVE LIBRARY
var massive = require('massive');

module.exports = {
  get_instance: function(PG_URI) {
    return massive.connectSync({connectionString: PG_URI /*, scripts: '/sql'*/});
    // return pgp(PG_URI);
  },
  disconnect: function() {
    // pgp.end();
  },
  find_or_create_user: function(pg, id, displayName) {
    // return pg.query({
    //   name: "find-or-create-user",
    //   text: "INSERT INTO Users (uID, display_name) " +
    //         "SELECT $1, $2 " +
    //         "WHERE NOT EXISTS ( " +
    //           "SELECT uID " +
    //           "FROM Users " +
    //           "WHERE uID = $1 " +
    //         ")",
    //   values: [id, displayName]
    // });
    return Promise.promisify(pg.find_or_create_user)(id, displayName);
  }
};
