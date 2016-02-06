"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.controller(
    "requestsController",
    ["$scope", "Transact", "IncomingBookRequests", "OutgoingBookRequests",function($scope, Transact, IncomingBookRequests, OutgoingBookRequests) {

      // in this view, a user can:
      //  -view requests for his/her books
      //  -deny another user's book request
      //  -check out a book to another user
      //  -view books he/she has requested
      //  -cancel a book request

      $scope.incomingBookRequests = IncomingBookRequests.getAll();
      $scope.outgoingBookRequests = OutgoingBookRequests.getAll();

      $scope.denyBookRequest   = Transact.denyBookRequest;
      $scope.checkoutBook      = Transact.checkoutBook;
      $scope.cancelBookRequest = Transact.cancelBookRequest;

      // var getUserData = function() {
      //   rest.getUser(function(data) {
      //     console.log("User Grab Success");
      //     console.log(data);

      //     $scope.selfRequests = data.requests;
      //     $scope.selfBorrowing = data.borrowing;

      //     if ($scope.selfRequests.length === 0) {
      //       $scope.noSelfRequests = true;
      //     } else {
      //       $scope.noSelfRequests = false;
      //     }

      //     if ($scope.selfBorrowing.length === 0) {
      //       $scope.noneApproved = true;
      //     } else {
      //       $scope.noneApproved = false;
      //     }
      //   });
      // }

      // getUserData();

      // $scope.removeRequest = function(bookId, closure) {
      //   rest.undoRequest(bookId, function(data) {
      //     console.log("Undo Request");
      //     console.log(data);
      //     getUserData();
      //   });
      // };

      // $scope.acceptRequest = function(userData) {
      //   rest.approveRequest(userData, function(data) {
      //     console.log("Request Accepted");
      //     console.log(data);
      //     getUserData();
      //   });
      // };

      // $scope.rejectRequest = function(userData) {
      //   rest.denyRequest(userData, function(data) {
      //     console.log("Request Rejected");
      //     console.log(data);
      //     getUserData();
      //   });
      // };

      // $scope.returnBook = function(userData) {
      //   rest.bookReturn(userData, function(data) {
      //     console.log("Book Returned");
      //     console.log(data);
      //     getUserData();
      //   });
      // };
    }]
  );
};
