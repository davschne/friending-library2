'use strict';

module.exports = function(friendingLibrary) {

  friendingLibrary.controller('appController', ['$scope', '$state', 'RESTService', '$cookies', function($scope, $state, http, $cookies) {

    var clientLogout = function() {
      $state.go("public");
    };

    var serverLogout = function(token) {
      http.logout(token, function() {});
      clientLogout();
    };

    $scope.clientLogout = clientLogout;
    $scope.serverLogout = serverLogout;
  }]);
};
