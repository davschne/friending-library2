"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.controller(
    "findBooksController", ["$scope", "$state", "Transact", "AvailableBooks",
    function($scope, $state, Transact, AvailableBooks) {

      // in this view, a user can:
      // - view books available to request
      // - request books

      $scope.availableBooks = AvailableBooks.getAll();

      $scope.requestBook = Transact.requestBook;

      // show record details in a modal:
      $scope.showDetails = function(record) {
        $state.go("app.find_books.copy_details", { record: record });
      };
    }]
  );
};
