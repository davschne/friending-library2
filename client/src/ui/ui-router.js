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
    .state("app.find_books.copy_details", {
      controller: "detailsController",
      templateUrl: templates.copy_details,
      params: { record: null }
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
