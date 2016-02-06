"use strict";

require("angular/angular");
require("angular-route");
require("angular-cookies");
require("angular-ui-router");

// paths to templates (relative to bundle.js)
var templates = {
  public     : "ui/public/public.html",
  app        : "ui/app/app.html",
  find_books : "ui/app/find_books/find_books.html",
  my_library : "ui/app/my_library/my_library.html",
  requests   : "ui/app/requests/requests.html"
};

// create module
var friendingLibrary = angular.module(
  "friendingLibrary",
  ["ngRoute", "ngCookies", "ui.router"]
);

// load shared services
require("./shared/REST.js")(friendingLibrary);
require("./shared/LoginLogout.js")(friendingLibrary);
require("./shared/Token.js")(friendingLibrary);
require("./shared/Transact.js")(friendingLibrary);

// load data models
require("./model/AvailableBooks.js")(friendingLibrary);
// require("./model/OutgoingBookRequests.js")(friendingLibrary);
// require("./model/Borrowed.js")(friendingLibrary);
// require("./model/OwnBooks.js")(friendingLibrary);
// require("./model/IncomingBookRequests.js")(friendingLibrary);
// require("./model/Lent.js")(friendingLibrary);

// load controllers
require("./ui/root.js")(friendingLibrary);
require("./ui/app/app.js")(friendingLibrary);
require("./ui/app/find_books/find_books.js")(friendingLibrary);
require("./ui/app/my_library/my_library.js")(friendingLibrary);
require("./ui/app/requests/requests.js")(friendingLibrary);

// load UI routing
require("./ui/ui-router.js")(friendingLibrary, templates);
