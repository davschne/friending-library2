'use strict';

module.exports = function(app) {

  app.controller('myBooksController', ['$scope', '$location', 'httpService', '$cookies', function($scope, $location, httpService, $cookies) {

    var http = httpService;
    var token = $scope.user.access_token;

    $scope.bookRequests = [];
    $scope.borrowedBooks = [];
    $scope.availableBooks = [];

    $scope.getOwnBooks = function() {
      http.getOwnBooks(token, function(data) {
        console.log('Book Grab Success');
        console.log(data);

        $scope.userBooks = data;

        for(var i = 0; i < $scope.userBooks.length; i++) {
          if ($scope.userBooks[i].request) {
            $scope.bookRequests.push($scope.userBooks[i]);
          } else if ($scope.userBooks[i].borrower) {
            $scope.borrowedBooks.push($scope.userBooks[i]);
          } else {
            $scope.availableBooks.push($scope.userBooks[i]);
          }
        }

        if ($scope.availableBooks.length === 0) {
          $scope.allRequested = true;
        } else {
          $scope.allRequested = false;
        }

        if ($scope.borrowedBooks.length === 0) {
          $scope.noneBorrowed = true;
        } else {
          $scope.noneBorrowed = false;
        }

        if ($scope.bookRequests.length === 0) {
          $scope.noRequests = true;
        } else {
          $scope.noRequests = false;
        }
      });
    }

    getOwnBooks();

    $scope.searchByISBN = function(userData) {
      http.queryGoogleBooks(userData, function(data) {
        console.log('Google Data Back');
        console.log(data);

        var rawData = data.items;
        console.log(rawData);

        $scope.checkResult = false;

        if(!(rawData)) {
          $scope.checkResult = true;
        } else {
          var usefulInfo = {
            "author" : data.items[0].volumeInfo.authors,
            "title" : data.items[0].volumeInfo.title,
            "genre" : data.items[0].volumeInfo.categories,
            "images" : data.items[0].volumeInfo.imageLinks,
            "description" : data.items[0].volumeInfo.description
          };

          $scope.googleData = usefulInfo;
          delete $scope.googlebook;
        }
      });
    };

    $scope.submitBook = function(token, userData) {
      http.createBook(token, userData, function(data) {
        console.log('Submit Success');
        console.log(data);
        getUserBooks(token);
      });

      delete $scope.googleData;
    };

    $scope.destroyBook = function(token, bookId) {
      http.removeBook(token, bookId, function(data) {
        console.log('Removed Book!');
        console.log(data);
        getUserBooks(token);
      });
    };
  }]);
};
