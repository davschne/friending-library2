'use strict';

module.exports = function(app) {

  app.controller('booksController', ['$scope', 'httpService', '$cookies', '$location', function($scope, httpService, $cookies, $location) {

    var http = httpService;

    (function() {

      if($location.search().access_token || ($cookies.get('tok').length > 3)) {
        runResource();
      }

      if($cookies.get('tok') === '' || (!$cookies.get('tok'))) {
        $location.path('/');
      }

      function runResource() {

        var token = $cookies.get('tok');
        $scope.user = {
          access_token: token
        };

        var populateBookPile = function(token) {
          http.availableBooks(token, function(data) {
            console.log('Inside function');
            console.log(data);

            $scope.books = data;

            for(var i = 0; i < $scope.books.length; i++) {
              $scope.books[i].showDescription = false;
            }

            $scope.toggleDescription = function(choice, bookObj) {
              if(choice === 1) {
                bookObj.showDescription = true;
              } else {
                bookObj.showDescription = false;
              }
            };

            if($scope.books.length === 0) {
              $scope.noBooks = true;
            } else {
              $scope.noBooks = false;
            }
          });
        };

        populateBookPile(token);

        $scope.checkBook = function(token, bookId) {
          http.requestBook(token, bookId, function(data) {
            console.log('Checked Out');
            console.log(data);

            populateBookPile(token);
          });
        };

        $scope.userLogOut = function(user) {
          http.logOut(user, function(data) {
            console.log('Logged Out');
            console.log(data);
          })

          $cookies.put('tok', '');
          $location.path('/');
        };
      };

    })();

  }]);

};
