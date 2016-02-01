'use strict';

module.exports = function(friendingLibrary) {

  friendingLibrary.controller(
    'findBooksController',
    ['$scope', 'REST', '$cookies', '$location', function($scope, rest, $cookies, $location) {

      var populateBookPile = function() {
        rest.availableBooks(function(data) {
          console.log("available books:", data);

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

      populateBookPile();

      $scope.toggleDescription = function(choice, bookObj) {
        if(choice === 1) {
          bookObj.showDescription = true;
        } else {
          bookObj.showDescription = false;
        }
      };

      $scope.requestBook = function(bookId) {
        rest.requestBook(bookId, function(data) {
          console.log('Checked Out');
          console.log(data);

          populateBookPile();
        });
      };
    }]
  );
};
