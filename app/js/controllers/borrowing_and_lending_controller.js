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

    $scope.removeRequest = function(token, bookId, closure) {
      http.undoRequest(token, bookId, function(data) {
        console.log('Undo Request');
        console.log(data);
        getUserData(token);
      });
    };

    $scope.acceptRequest = function(token, userData) {
      http.approveRequest(token, userData, function(data) {
        console.log('Request Accepted');
        console.log(data);
        getUserData(token);
      });
    };

    $scope.rejectRequest = function(token, userData) {
      http.denyRequest(token, userData, function(data) {
        console.log('Request Rejected');
        console.log(data);
        getUserData(token);
      });
    };

    $scope.returnBook = function(token, userData) {
      http.bookReturn(token, userData, function(data) {
        console.log('Book Returned');
        console.log(data);
        getUserData(token);
      });
    };
  }]);
};
