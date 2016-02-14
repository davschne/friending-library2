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
    }]
  );
};
