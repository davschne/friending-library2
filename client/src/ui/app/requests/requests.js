'use strict';

module.exports = function(friendingLibrary) {

  friendingLibrary.controller(
    'requestsController',
    ['$scope', 'REST', '$cookies', function($scope, rest, $cookies) {

      var getUserData = function() {
        rest.getUser(function(data) {
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

      getUserData();

      $scope.removeRequest = function(bookId, closure) {
        rest.undoRequest(bookId, function(data) {
          console.log('Undo Request');
          console.log(data);
          getUserData();
        });
      };

      $scope.acceptRequest = function(userData) {
        rest.approveRequest(userData, function(data) {
          console.log('Request Accepted');
          console.log(data);
          getUserData();
        });
      };

      $scope.rejectRequest = function(userData) {
        rest.denyRequest(userData, function(data) {
          console.log('Request Rejected');
          console.log(data);
          getUserData();
        });
      };

      $scope.returnBook = function(userData) {
        rest.bookReturn(userData, function(data) {
          console.log('Book Returned');
          console.log(data);
          getUserData();
        });
      };
    }]
  );
};
