'use strict';

module.exports = function(app) {

  app.controller('authController', ['$scope', '$location', 'authResource', '$cookies', function($scope, $location, authResource, $cookies) {

    var Http = authResource();

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
      Http.logOut(token, function(data) {
        console.log('Logged Out');
        console.log(data);
      });

      // TODO : possible to delete the cookie?

      $cookies.put('tok', '');
      $location.path('/');
    };

  }]);

};
