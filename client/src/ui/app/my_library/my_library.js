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
      $scope.createCopy  = Transact.createCopy;
      $scope.deleteCopy  = Transact.deleteCopy;

      // look up a book on Google Books (returns a Promise)
      //  CAN ANGULAR DIRECTIVE DEAL WITH A PROMISE VALUE
      //  OR IS IT NECESSARY TO SET SOME PROPERTY ON THE SCOPE
      //  IN A CALLBACK ?
      $scope.getBookRecordByISBN = GoogleBooks.queryByISBN;

      // $scope.bookRequests = [];
      // $scope.borrowedBooks = [];
      // $scope.availableBooks = [];

      // var getOwnBooks = function() {
      //   rest.getOwnBooks(function(data) {
      //     console.log("Book Grab Success");
      //     console.log(data);

      //     $scope.userBooks = data;

      //     for(var i = 0; i < $scope.userBooks.length; i++) {
      //       if ($scope.userBooks[i].request) {
      //         $scope.bookRequests.push($scope.userBooks[i]);
      //       } else if ($scope.userBooks[i].borrower) {
      //         $scope.borrowedBooks.push($scope.userBooks[i]);
      //       } else {
      //         $scope.availableBooks.push($scope.userBooks[i]);
      //       }
      //     }

      //     if ($scope.availableBooks.length === 0) {
      //       $scope.allRequested = true;
      //     } else {
      //       $scope.allRequested = false;
      //     }

      //     if ($scope.borrowedBooks.length === 0) {
      //       $scope.noneBorrowed = true;
      //     } else {
      //       $scope.noneBorrowed = false;
      //     }

      //     if ($scope.bookRequests.length === 0) {
      //       $scope.noRequests = true;
      //     } else {
      //       $scope.noRequests = false;
      //     }
      //   });
      // }

      // $scope.searchByISBN = searchByISBN;

      // $scope.getOwnBooks = getOwnBooks;
      // $scope.createBook   = createBook;

      // getOwnBooks();

      // $scope.searchByISBN = function(userData) {
      //   rest.queryGoogleBooks(userData, function(data) {
      //     console.log("Google Data Back");
      //     console.log(data);

      //     var rawData = data.items;
      //     console.log(rawData);

      //     $scope.checkResult = false;

      //     if(!(rawData)) {
      //       $scope.checkResult = true;
      //     } else {
      //       var usefulInfo = {
      //         "author" : data.items[0].volumeInfo.authors,
      //         "title" : data.items[0].volumeInfo.title,
      //         "genre" : data.items[0].volumeInfo.categories,
      //         "images" : data.items[0].volumeInfo.imageLinks,
      //         "description" : data.items[0].volumeInfo.description
      //       };

      //       $scope.googleData = usefulInfo;
      //       delete $scope.googlebook;
      //     }
      //   });
      // };

      // var createBook = function(bookObj) {
      //   rest.createBook(bookObj, function(data) {
      //     console.log("Submit Success");
      //     console.log(data);
      //     getOwnBooks();
      //   });

      //   delete $scope.googleData;
      // };

      // $scope.destroyBook = function(bookId) {
      //   rest.removeBook(bookId, function(data) {
      //     console.log("Removed Book!");
      //     console.log(data);
      //     getUserBooks();
      //   });
      // };
    }]
  );
};
