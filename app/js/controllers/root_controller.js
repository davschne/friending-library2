'use strict';

module.exports = function(app) {

  app.controller('authController', ['$rootScope', '$location', 'httpService', '$cookies', function($rootScope, $location, httpService, $cookies) {

    var http = httpService;

    var getToken = function() {

      // check query string for token
      var token = $location.search().access_token;

      if (token) {
        // store it in a cookie
        $cookies.put("friending_library_access_token", token);
      } else {
        // check cookie for token
        token = $cookies.get("friending_library_access_token");
      }

      return token;
    }

    var token = getToken();

    if (token) {
      // add token to $rootScope
      $rootScope.user = { access_token: token };
      // proceed to app
      $location.url('/available_books');
    } else {
      // redirect to root for sign-in
      $location.url('/');
    }

    function clientLogout() {
      delete $rootScope.user;
      $cookies.remove("friending_library_access_token");
      $location.url('/');
    }

    function serverLogout(token) {
      http.logout(token, function() {});
      clientLogout();
    }

    $rootScope.clientLogout = clientLogout;
    $rootScope.serverLogout = serverLogout;
  }]);
};
