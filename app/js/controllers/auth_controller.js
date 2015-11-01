'use strict';

module.exports = function(app) {

  app.controller('authController', ['$scope', '$location', 'httpService', '$cookies', function($scope, $location, httpService, $cookies) {

    var http = httpService;

    var grabToken = function() {

      // TODO : fix naming conventions here ($scope.user, not .userToken)

      return function() {
        var token = {
          access_token : $cookies.get('tok')
        };

        $scope.userToken = token;
      };
    };

    grabToken();

    $scope.userLogOut = function(token) {
      http.logOut(token, function(data) {
        console.log('Logged Out');
        console.log(data);
      });

      // TODO : possible to delete the cookie?

      $cookies.put('tok', '');
      $location.path('/');
    };
  }]);
};
