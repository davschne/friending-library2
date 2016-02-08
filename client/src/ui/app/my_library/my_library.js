"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.controller(
    "myLibraryController",
    ["$scope", "Transact", "OwnBooks", "Borrowed", "Lent", "GoogleBooks",
    function($scope, Transact, OwnBooks, Borrowed, Lent, GoogleBooks) {

      // in this view, a user can:
      //  -view books owned
      //  -view books lent
      //  -view books borrowed
      //  -check in a lent book
      //  -look up books using the Google Books API
      //  -add books
      //  -delete books

      // populate fields
      $scope.ownBooks = OwnBooks.getAll();
      $scope.borrowed = Borrowed.getAll();
      $scope.lent     = Lent.getAll();

      // transaction utilities
      $scope.checkinBook = Transact.checkinBook;
      $scope.deleteCopy  = Transact.deleteCopy;

      // utilities for finding and creating a book record

      $scope.queryResult;
      // look up a book on Google Books
      $scope.getBookRecordByISBN = function(isbn) {
        GoogleBooks.queryByISBN(isbn)
        .then(function(book) {
          $scope.queryResult = book;
        });
      };

      $scope.createCopy  = function(book) {
        Transact.createCopy(book);
        $scope.queryResult = null;
      };
    }]
  );
};
