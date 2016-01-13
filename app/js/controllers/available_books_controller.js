'use strict';

module.exports = function(app) {

  app.controller('availableBooksController', ['$scope', 'httpService', '$cookies', '$location', function($scope, httpService, $cookies, $location) {

    var http = httpService;
    var token = $scope.user.access_token;

    var populateBookPile = function(token) {
      http.availableBooks(token, function(data) {
        console.log('Inside function');
        console.log(data);

        $scope.books = data;

        for(var i = 0; i < $scope.books.length; i++) {
          $scope.books[i].showDescription = false;
        }

        if($scope.books.length === 0) {
          $scope.noBooks = true;
        } else {
          $scope.noBooks = false;
        }
      });
    };

    populateBookPile(token);

    http.testAPI(token, function(data) {
      console.log('testAPI success', data);
    });

    $scope.toggleDescription = function(choice, bookObj) {
      if(choice === 1) {
        bookObj.showDescription = true;
      } else {
        bookObj.showDescription = false;
      }
    };

    $scope.requestBook = function(token, bookId) {
      http.requestBook(token, bookId, function(data) {
        console.log('Checked Out');
        console.log(data);

        populateBookPile(token);
      });
    };
  }]);
};
