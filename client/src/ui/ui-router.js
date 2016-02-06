"use strict";

module.exports = function(friendingLibrary, templates) {

  // UI routing
  friendingLibrary.config(["$stateProvider", function($stateProvider) {

    $stateProvider
    .state("public", {
      // controller: "publicController",
      templateUrl: templates.public
    })
    .state("app", {
      abstract: true,
      // controller: "appController",
      templateUrl: templates.app
    })
    .state("app.find_books", {
      controller: "findBooksController",
      templateUrl: templates.find_books
    })
    .state("app.my_library", {
      controller: "myLibraryController",
      templateUrl: templates.my_library
    })
    .state("app.requests", {
      controller: "requestsController",
      templateUrl: templates.requests
    });
  }]);
}
