"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.controller(
    "findBooksController", ["$scope", "Transact", "AvailableBooks",
    function($scope, Transact, AvailableBooks) {

      // in this view, a user can:
      // - view books available to request
      // - request books

      $scope.availableBooks = AvailableBooks.getAll();

      $scope.requestBook = Transact.requestBook;

      // $scope.toggleDescription = function(choice, bookObj) {
      //   if(choice === 1) {
      //     bookObj.showDescription = true;
      //   } else {
      //     bookObj.showDescription = false;
      //   }
      // };
    }]
  );
};
