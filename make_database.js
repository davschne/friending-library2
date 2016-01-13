var dbUtil = require('./lib/db-util.js');
var PG_ADMIN_URI = process.env.PG_ADMIN_URI || 'postgres://postgres:@127.0.0.1:5432/template1';

var pg_admin = dbUtil.getInstance(PG_ADMIN_URI);

// console.log(pg_admin);

dbUtil.createOwnerAndDatabase(
  pg_admin,                 // instance
  'friending_library_user', // owner
  'test',                   // password
  'friending_library',      // database name
  'template1'               // template
);
