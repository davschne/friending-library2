'use strict';

module.exports = function(app) {

  app.controller('authController', ['$scope', '$location', 'httpService', '$cookies', function($scope, $location, httpService, $cookies) {

    var http = httpService;

    var getToken = function() {

      // check query string for token
      var token = $location.search().access_token;
      console.log("token from query string: " + token)

      if (token) {
        // store it in a cookie
        $cookies.put('tok', token);
      } else {
        // check cookie for token
        token = $cookies.get('tok');
        console.log("token from cookie: " + token);
      }

      return token;
    }

    var token = getToken();

    if (token) {
      // add token to $scope
      $scope.user = { access_token: token };
      // proceed to app
      console.log("redirecting to /available_books");
      $location.url('/available_books');
    } else {
      // redirect to root for sign-in
      console.log("redirecting to /");
      $location.url('/');
    }

    $scope.userLogOut = function(token) {
      http.logOut(token, function(data) {
        console.log('Logged Out');
        console.log(data);
      });

      delete $scope.user;
      $cookies.remove('tok');
      $location.url('/');
    };
  }]);
};
