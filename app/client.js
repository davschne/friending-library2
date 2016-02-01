'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-ui-router');

// paths to templates (relative to bundle.js)
var templates = {
  public     : "components/public/public.html",
  app        : "components/app/app.html",
  find_books : "components/app/find_books/find_books.html",
  my_library : "components/app/my_library/my_library.html",
  requests   : "components/app/requests/requests.html"
};

// create module
var friendingLibrary = angular.module(
  'friendingLibrary',
  ['ngRoute', 'ngCookies', 'ui.router']
);

// load services
require('./components/services/rest_service.js')(friendingLibrary);
require('./components/services/auth_service.js')(friendingLibrary);

// load controllers
require("./root_controller.js")(friendingLibrary);
require("./components/app/app_controller.js")(friendingLibrary);
require("./components/app/find_books/find_books_controller.js")(friendingLibrary);
require("./components/app/my_library/my_library_controller.js")(friendingLibrary);
require("./components/app/requests/requests_controller.js")(friendingLibrary);

// load UI routing
require('./components/ui-router.js')(friendingLibrary, templates);
