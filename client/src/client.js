"use strict";

require("angular/angular");
require("angular-route");
require("angular-cookies");
require("angular-ui-router");

// paths to templates (relative to bundle.js)
var templates = {
  public     : "ui-states/public/public.html",
  app        : "ui-states/app/app.html",
  find_books : "ui-states/app/find_books/find_books.html",
  my_library : "ui-states/app/my_library/my_library.html",
  requests   : "ui-states/app/requests/requests.html"
};

// create module
var friendingLibrary = angular.module(
  "friendingLibrary",
  ["ngRoute", "ngCookies", "ui.router"]
);

// load services
require("./util/REST.js")(friendingLibrary);
require("./util/login-logout.js")(friendingLibrary);
require("./model/token.js")(friendingLibrary);

// load controllers
require("./ui-states/root.js")(friendingLibrary);
require("./ui-states/app/app.js")(friendingLibrary);
require("./ui-states/app/find_books/find_books.js")(friendingLibrary);
require("./ui-states/app/my_library/my_library.js")(friendingLibrary);
require("./ui-states/app/requests/requests.js")(friendingLibrary);

// load UI routing
require("./ui-states/ui-router.js")(friendingLibrary, templates);
