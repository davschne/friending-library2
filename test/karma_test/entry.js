// load app (the source code version)
require("../../client/src/client.js");

require("angular-mocks");

// unit tests
require(__dirname + "/REST_tests.js");
require(__dirname + "/Token_tests.js");
require(__dirname + "/LoginLogout_tests.js");
require(__dirname + "/AvailableBooks_tests.js");
