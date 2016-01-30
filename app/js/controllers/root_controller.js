'use strict';

module.exports = function(app) {

  app.controller('authController', ['$rootScope', '$location', 'httpService', '$cookies', function($rootScope, $location, httpService, $cookies) {

    var http = httpService;

    var init = function() {

      // check query string for token
      var token = $location.search().access_token;

      if (!token) {
        // check cookie for token
        token = $cookies.get("friending_library_access_token");
        if (!token) {
          // redirect to root for sign-in
          $location.url('/');
        }
      }
      // store it in a cookie
      $cookies.put("friending_library_access_token", token);

      // add it to $rootScope
      $rootScope.user = { access_token: token };

      // proceed to app
      $location.url('/available_books');
    }

    var clientLogout = function() {
      delete $rootScope.user;
      $cookies.remove("friending_library_access_token");
      $location.url('/');
    }

    var serverLogout = function(token) {
      http.logout(token, function() {});
      clientLogout();
    }

    $rootScope.init         = init;
    $rootScope.clientLogout = clientLogout;
    $rootScope.serverLogout = serverLogout;

    // GO
    init();

  }]);
};
