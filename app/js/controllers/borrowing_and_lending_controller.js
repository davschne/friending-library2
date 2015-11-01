'use strict';

module.exports = function(app) {

  app.controller('borrowingAndLendingController', ['$scope', '$location', 'httpService', '$cookies', function($scope, $location, httpService, $cookies) {

    var http = httpService;
    var token = $scope.user.access_token;

    var getUserData = function(token) {
      http.getUser(token, function(data) {
        console.log('User Grab Success');
        console.log(data);

        $scope.selfRequests = data.requests;
        $scope.selfBorrowing = data.borrowing;

        if ($scope.selfRequests.length === 0) {
          $scope.noSelfRequests = true;
        } else {
          $scope.noSelfRequests = false;
        }

        if ($scope.selfBorrowing.length === 0) {
          $scope.noneApproved = true;
        } else {
          $scope.noneApproved = false;
        }
      });
    }

    getUserData(token);

    $scope.askGoogle = function(userData) {
      http.connectGoogleBooks(userData, function(data) {
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

    $scope.submitBook = function(user, userData) {
      http.createBook(user, userData, function(data) {
        console.log('Submit Success');
        console.log(data);
      });

      getUserBooks(user);
      delete $scope.googleData;
    };

    $scope.destroyBook = function(user, bookId) {
      http.removeBook(user, bookId, function(data) {
        console.log('Removed Book!');
        console.log(data);

        getUserBooks(user);
      });
    };

    $scope.removeRequest = function(user, bookId, closure) {
      http.undoRequest(user, bookId, function(data) {
        console.log('Undo Request');
        console.log(data);

        getUserData(user);
      });
    };

    $scope.acceptRequest = function(user, userData) {
      http.approveRequest(user, userData, function(data) {
        console.log('Request Accepted');
        console.log(data);

        getUserBooks(user);
      });
    };

    $scope.rejectRequest = function(user, userData) {
      http.denyRequest(user, userData, function(data) {
        console.log('Request Rejected');
        console.log(data);

        getUserBooks(user);
      });
    };

    $scope.returnBook = function(user, userData) {
      http.bookReturn(user, userData, function(data) {
        console.log('Book Returned');
        console.log(data);

        getUserBooks(user);
      });
    };
  }]);
};
